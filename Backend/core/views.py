import PyPDF2  
import io     
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .utils import check_s3_connection, upload_to_s3 
from django.conf import settings
from libraries.futurefit_core import FutureFitAnalyzer
from .serializers import ResumeUploadSerializer 
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

def s3_test_view(request):
    result = check_s3_connection()
    return JsonResponse(result)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

class ResumeUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = ResumeUploadSerializer

    def get(self, request):
        return Response({"message": "upload the file"})

    def post(self, request, *args, **kwargs):
        serializer = ResumeUploadSerializer(data=request.data)
        
        if serializer.is_valid():
            file_obj = serializer.validated_data['file']
            file_name = file_obj.name

            # 1. File ko memory mein copy karna taaki "Closed File" error na aaye
            file_content = file_obj.read()
            file_copy = io.BytesIO(file_content)
            file_obj.seek(0)

           
            success = upload_to_s3(file_obj, settings.AWS_STORAGE_BUCKET_NAME, file_name)

            if not success:
                return Response({"error": "S3 Upload Failed"}, status=500)

            # 3. REAL TEXT EXTRACTION (Using the memory copy)
            extracted_text = ""
            try:
                pdf_reader = PyPDF2.PdfReader(file_copy)
                for page in pdf_reader.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + " "
            except Exception as e:
                return Response({"error": f"PDF extraction failed: {str(e)}"}, status=500)

            if not extracted_text.strip():
                return Response({"error": "PDF mein text nahi mila!"}, status=400)

            # 4. ANALYSIS LOGIC
            analyzer = FutureFitAnalyzer(extracted_text)
            result = analyzer.get_readiness_score()

            file_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{file_name}"

            return Response({
                "status": "success",
                "file_url": file_url,
                "analysis": result
        })

            return Response({
                "status": "success",
                "message": f"{file_name} process finished!",
                "analysis": result
            })
        
        return Response(serializer.errors, status=400)
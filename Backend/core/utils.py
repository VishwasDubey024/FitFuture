import boto3
from django.conf import settings
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

def get_s3_client():
    """Helper function to create S3 client with session token."""
    return boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        aws_session_token=settings.AWS_SESSION_TOKEN,
        region_name=settings.AWS_S3_REGION_NAME
    )

def check_s3_connection():
    try:
        s3 = get_s3_client()
        response = s3.list_buckets()
        buckets = [bucket['Name'] for bucket in response['Buckets']]
        
        return {
            "status": "success",
            "message": "AWS S3 se connection ekdum mast hai!",
            "buckets": buckets
        }
    except NoCredentialsError:
        return {"status": "error", "message": "Credentials nahi mile."}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def upload_to_s3(file_obj, bucket_name, object_name):
    """Function to upload a file object to S3."""
    try:
        s3 = get_s3_client()
        s3.upload_fileobj(file_obj, bucket_name, object_name)
        return True
    except Exception as e:
        print(f"Upload error: {e}")
        return False
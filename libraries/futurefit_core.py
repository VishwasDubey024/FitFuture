class FutureFitAnalyzer:
    def __init__(self, resume_text):
        self.resume_text = resume_text.lower()
        self.categories = {
            "Cloud/DevOps": ['aws', 'azure', 'docker', 'kubernetes', 'terraform', 'cloudwatch', 's3', 'ec2'],
            "Backend": ['python', 'django', 'flask', 'java', 'spring boot', 'node.js', 'postgresql', 'sql'],
            "Frontend": ['react', 'vite', 'tailwind', 'javascript', 'html', 'css', 'next.js']
        }

    def get_readiness_score(self):
        analysis_report = {}
        total_found = 0
        
        for category, skills in self.categories.items():
            found = [s for s in skills if s in self.resume_text]
            score = len(found) * 20 # Har skill ke 20 points (max 100 per category)
            analysis_report[category] = {
                "score": min(score, 100),
                "skills": found
            }
            total_found += len(found)

        overall_score = min(round((total_found / 12) * 100), 100)
        
        return {
            "overall_score": overall_score,
            "breakdown": analysis_report,
            "feedback": self.get_custom_feedback(overall_score)
        }

    def get_custom_feedback(self, score):
        if score > 75: return "Cloud Architect Level! Ready for Internship."
        if score > 40: return "Strong Developer profile. Focus more on DevOps."
        return "Early Stage: Need to diversify your tech stack."
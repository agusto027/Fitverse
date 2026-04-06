import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class CoachEngine:
    def __init__(self):
        # A lightweight knowledge base mapping intents/questions to expert responses
        self.knowledge_base = {
            "weight loss fat burning slim down cardio calories deficit": 
                "For effective weight loss, focus on a caloric deficit (burning more calories than you consume). Combine this with 3-4 days of cardiovascular training and full-body strength workouts. Our Diet Planner can help you calculate exact macros under 'Fat Loss'!",
                
            "build muscle hypertrophy gain weight lifting weights gym bulk": 
                "Building muscle requires a caloric surplus (eating slightly more calories than you burn) and progressive overload in the gym. Aim for 1.6-2.2g of protein per kg of bodyweight, and focus on compound lifts like Squats, Deadlifts, and Bench Press.",
                
            "diet tips nutrition food healthy unheathy eating hungry protein carbs": 
                "Nutrition is key! Start by drinking at least 2.5L of water daily. Ensure every meal contains a solid protein source. Don't fear carbs—they give you energy for your workouts. Avoid highly processed sugars, but allow yourself a small treat weekly to stay sane.",
                
            "workout plan routine schedule what should i do exercise days split rest": 
                "Check out the 'Workout Planner' module on the sidebar! A good start is a 3-day Full Body routine, or a 4-day Upper/Lower split. Make sure you get at least 2 solid days of active rest (walking, yoga) to let your muscles recover.",
                
            "stay motivated motivation discipline lazy bored quit give up stop consistency": 
                "Consistency always beats intensity. You don't need to be 100% perfect every day, just don't quit. Track small wins, like drinking an extra glass of water or doing 5 pushups. Discipline starts when motivation fades. You've got this!",
                
            "better sleep tired exhausted rest recovery recover late night habits hours": 
                "Sleep is where your muscles actually grow and your fat burns! Aim for 7-9 hours per night. Avoid screens 1 hour before bed, lower your room temperature, and try not to consume caffeine after 3 PM.",
                
            "squat form how to squats knee pain depth depth bad knees rep counting": 
                "When squatting, keep your chest up, push your hips back like sitting in a chair, and ensure your knees track over your toes without caving in. You can use my 'Exercise Detection' page and my Computer Vision algorithms will watch your depth for you!",
                
            "pushup push ups chest arms elbows form how to rep counting": 
                "Keep your body entirely straight like a plank. Flaring your elbows out at 90 degrees can hurt your shoulders—tuck them in slightly at a 45-degree angle. Lower yourself fully until your chest is just above the floor.",
                
            "hello hi hey greetings good morning evening there wassup": 
                "Hello there! I am your FitVerse AI Coach. Whether it's nutrition, weight lifting mechanics, tracking reps, or building a schedule, I'm here to help. What are your fitness goals?",
                
            "who are you what can you do help me support functions": 
                "I am the proprietary AI Coach for FitVerse! I use Natural Language Processing to analyze your fitness queries. I can give you advice regarding workouts, diets, form constraints, or answer general fitness questions based on our expert database."
        }
        
        self.corpus = list(self.knowledge_base.keys())
        self.responses = list(self.knowledge_base.values())
        
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(self.corpus)
        
    def get_response(self, user_input):
        # Convert user input to tf-idf vector
        input_vec = self.vectorizer.transform([user_input])
        
        # Calculate cosine similarity against absolute topics in our KB
        similarity_scores = cosine_similarity(input_vec, self.tfidf_matrix)
        
        best_match_idx = np.argmax(similarity_scores)
        best_match_score = similarity_scores[0][best_match_idx]
        
        # Threshold limit. If we aren't at least 15% confident they are talking about this topic, fallback.
        if best_match_score < 0.15:
            return "I'm mostly calibrated to help you with fitness tips, diet strategies, workout plans, and exercise forms. Could you rephrase your question regarding your fitness goals?"
            
        return self.responses[best_match_idx]

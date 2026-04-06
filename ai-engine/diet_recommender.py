import pandas as pd
import random
import os

class DietRecommender:
    def __init__(self, dataset_path):
        self.dataset_path = dataset_path
        self.df = None
        self._load_dataset()

    def _load_dataset(self):
        try:
            # Check if running from ai-engine or root
            if os.path.exists(self.dataset_path):
                self.df = pd.read_csv(self.dataset_path)
            elif os.path.exists("../" + self.dataset_path):
                self.df = pd.read_csv("../" + self.dataset_path)
            else:
                print("Dataset not found!")
                self.df = pd.DataFrame()
        except Exception as e:
            print(f"Error loading dataset: {e}")
            self.df = pd.DataFrame()

    def recommend(self, gender, goal):
        if self.df is None or self.df.empty:
            return self._fallback_recommendation()

        # Simple filter logic based on target Goal & Gender match
        filtered = self.df
        
        # Filter by goal
        goal_mapping = 'Weight Gain' if goal == 'muscle-gain' else 'Weight Loss'
        
        if 'Disease' in self.df.columns:
            matches = self.df[self.df['Disease'].str.contains(goal_mapping, na=False, case=False)]
            # ensure we don't corner ourselves into a 1-row dataset
            if len(matches) >= 7:
                filtered = matches

        if 'Gender' in filtered.columns:
            matches = filtered[filtered['Gender'].str.lower() == gender.lower()]
            if len(matches) >= 7:
                filtered = matches

        week_plan = {}
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        
        if not filtered.empty:
            if len(filtered) >= 7:
                sampled_recs = filtered.sample(n=7, replace=False)
            else:
                sampled_recs = filtered.sample(n=7, replace=True)
                
            for i, day in enumerate(days):
                rec = sampled_recs.iloc[i]
                
                meals = [
                    {"type": "Breakfast", "name": str(rec.get('Breakfast Suggestion', 'Healthy Oatmeal')), "cals": int(rec.get('Calories', 2000) * 0.25), "p": int(rec.get('Protein', 100) * 0.25), "c": int(rec.get('Carbohydrates', 200) * 0.25), "f": int(rec.get('Fat', 60) * 0.25)},
                    {"type": "Lunch", "name": str(rec.get('Lunch Suggestion', 'Chicken Salad')), "cals": int(rec.get('Calories', 2000) * 0.35), "p": int(rec.get('Protein', 100) * 0.35), "c": int(rec.get('Carbohydrates', 200) * 0.35), "f": int(rec.get('Fat', 60) * 0.35)},
                    {"type": "Dinner", "name": str(rec.get('Dinner Suggestion', 'Grilled Salmon')), "cals": int(rec.get('Calories', 2000) * 0.30), "p": int(rec.get('Protein', 100) * 0.30), "c": int(rec.get('Carbohydrates', 200) * 0.30), "f": int(rec.get('Fat', 60) * 0.30)},
                    {"type": "Snacks", "items": [str(rec.get('Snack Suggestion', 'Apple with peanut butter'))]}
                ]
                
                week_plan[day] = {
                    "daily_targets": {
                        "calories": int(rec.get('Calories', 2000)),
                        "protein": int(rec.get('Protein', 100)),
                        "carbs": int(rec.get('Carbohydrates', 200)),
                        "fat": int(rec.get('Fat', 60))
                    },
                    "meals": meals
                }
        else:
            for day in days:
                week_plan[day] = self._fallback_single_day()
        
        return week_plan

    def _fallback_recommendation(self):
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        week_plan = {}
        for day in days:
            week_plan[day] = self._fallback_single_day()
        return week_plan

    def _fallback_single_day(self):
        return {
            "daily_targets": {
                "calories": 2000,
                "protein": 150,
                "carbs": 200,
                "fat": 65
            },
            "meals": [
                { "type": "Breakfast", "name": "Oatmeal and Eggs", "cals": 400, "p": 25, "c": 45, "f": 12 },
                { "type": "Lunch", "name": "Chicken Rice Bowl", "cals": 600, "p": 45, "c": 60, "f": 15 },
                { "type": "Dinner", "name": "Steak and Potatoes", "cals": 700, "p": 55, "c": 50, "f": 25 },
                { "type": "Snacks", "items": ["Greek Yogurt", "Almonds"] }
            ]
        }

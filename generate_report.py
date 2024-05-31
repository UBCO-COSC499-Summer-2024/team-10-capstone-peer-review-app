import os
import requests
import pandas as pd
import matplotlib.pyplot as plt
from fpdf import FPDF
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_OWNER = os.getenv("REPO_OWNER")
REPO_NAME = os.getenv("REPO_NAME")

def fetch_issues(repo_owner, repo_name, token):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues"
    headers = {"Authorization": f"token {token}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def generate_burnup_chart(issues, output_path):
    # Process issues to generate burnup chart data
    df = pd.DataFrame(issues)
    df['created_at'] = pd.to_datetime(df['created_at'])
    df['closed_at'] = pd.to_datetime(df['closed_at'])
    
    df['created_date'] = df['created_at'].dt.date
    df['closed_date'] = df['closed_at'].dt.date

    daily_counts = df.groupby('created_date').size().cumsum().reset_index(name='open_issues')
    daily_closes = df.groupby('closed_date').size().cumsum().reset_index(name='closed_issues')

    merged = pd.merge(daily_counts, daily_closes, how='outer', left_on='created_date', right_on='closed_date')
    merged = merged.fillna(method='ffill').fillna(0)

    plt.figure(figsize=(10, 6))
    plt.plot(merged['created_date'], merged['open_issues'], label='Open Issues')
    plt.plot(merged['closed_date'], merged['closed_issues'], label='Closed Issues')
    plt.xlabel('Date')
    plt.ylabel('Count')
    plt.title('Burnup Chart')
    plt.legend()
    plt.grid(True)
    plt.savefig(output_path)

def generate_report():
    issues = fetch_issues(REPO_OWNER, REPO_NAME, GITHUB_TOKEN)
    
    if not os.path.exists('weeklyLogs'):
        os.makedirs('weeklyLogs')
    
    generate_burnup_chart(issues, 'weeklyLogs/burnup_chart.png')
    
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(200, 10, 'Weekly Report', 0, 1, 'C')
    pdf.image('weeklyLogs/burnup_chart.png', x=10, y=20, w=190)
    pdf.output('weeklyLogs/weekly_report.pdf')
    
if __name__ == "__main__":
    generate_report()

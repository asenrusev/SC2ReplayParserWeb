# **Replay Summariser**

### **Description**

Replay Summariser is a web-based tool designed to help **StarCraft 2** players analyze their games by uploading replay files. The tool generates a concise summary with AI-ready prompts that can be used for further analysis through a large language model (like GPT). 

By focusing on build orders, unit choices, and overall game strategy, Replay Summariser simplifies post-game analysis for players looking to improve their gameplay. However, due to the limitations of replay files, specific unit movements and placements might be difficult to pinpoint. The tool is most effective for assessing build orders and unit compositions.

### **Project Structure**

- **Backend**: 
  - Built with **Flask** and **sc2reader** to process StarCraft 2 replays, extract key game data, and summarize it.
  
- **Frontend**: 
  - A **React** app with **TypeScript** and **Material UI** for a user-friendly interface where players can upload their replays and view the generated summary.
  
- **Key Features**:
  - Upload replay files and receive a structured breakdown.
  - Generate prompts for AI analysis.
  - Clear, concise insights focused on build order and unit choices.

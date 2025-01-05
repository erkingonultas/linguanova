# LinguaNova - AI-Powered Language Learning App

LinguaNova is an AI-powered language practicing application built with **React Native**. The app combines cutting-edge technologies like speech recognition, large language models, and engaging animations to deliver a personalized and immersive language learning experience.

---

## **Features**

### 1. **Speech Recognition for Pronunciation Practice**
- Real-time feedback on pronunciation accuracy using advanced speech recognition.

### 2. **Integration with Large Language Models**
- AI-powered conversation practice tailored to the user’s skill level.
- Dynamic prompts and responses to simulate real-world scenarios.

### 3. **Spaced Repetition Algorithm**
- Optimized vocabulary review schedules to reinforce learning.

---

## **Tech Stack**

- **Frontend**: React Native, React Navigation
- **AI Integration**: OpenAI GPT API
- **Animations**: react-native-reanimated, react-native-lottie

---

## **Getting Started**

### Prerequisites
- Node.js (v16 or higher)
- Yarn or npm
- Android Studio (for Android emulator) / Xcode (for iOS simulator)
- OpenAI API key for language model integration

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/erkingonultas/linguanova.git
   cd linguanova
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following:
     ```env
     apiKey=your_openai_api_key
     ```

4. Run the app:
   - For iOS:
     ```bash
     npx react-native run-ios
     ```
   - For Android:
     ```bash
     npx react-native run-android
     ```

# Nearby Chat App

A simple chat application built with React Native and Expo, designed to simulate discovering and chatting with nearby individuals. It features private messaging and a list of simulated nearby users, showcasing modern mobile development practices with a focus on clean architecture and state management.

## Features

-   **User Generation:** Automatically generates a unique user ID, username, and a distinct color for each session.
-   **Nearby Users Discovery:** Displays a list of simulated nearby users with their online/offline status.
-   **Private Chat:** Dedicated screen for private conversations with individual users.
-   **Message Input & Display:** Intuitive message input field with a send button and a list to display chat messages.
-   **Keyboard Avoiding:** Ensures the message input remains visible when the keyboard is active.
-   **State Management:** Utilizes Zustand for efficient and centralized state management.
-   **Styling:** Leverages NativeWind for a streamlined Tailwind CSS-like styling experience in React Native.

## Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js:** (LTS version recommended)
    -   [Download Node.js](https://nodejs.org/en/download/)
-   **npm** or **Yarn:** Package manager (npm comes with Node.js, Yarn can be installed globally).
    ```bash
    npm install -g yarn
    ```
-   **Expo Go App:** On your mobile device (iOS or Android) to easily test the app.
    -   [Expo Go for iOS](https://apps.apple.com/us/app/expo-go/id1394474973)
    -   [Expo Go for Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&gl=US)
-   **Optional: Xcode (for iOS Simulator) or Android Studio (for Android Emulator):** If you prefer to run the app on a simulator/emulator.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/hritiksharma/nearby-chat.git # Replace with actual repo URL if different
    cd nearby-chat
    ```

2.  **Install dependencies:**

    Using npm:
    ```bash
    npm install
    ```

    Using Yarn:
    ```bash
    yarn install
    ```

## Running the App

1.  **Start the Expo development server:**

    Using npm:
    ```bash
    npm start
    ```

    Using Yarn:
    ```bash
    yarn start
    ```
    This command will open a new tab in your browser with the Expo Dev Tools and display a QR code in your terminal.

2.  **Run on your device or simulator:**

    -   **On your physical device:** Open the **Expo Go** app and scan the QR code displayed in your terminal or browser.
    -   **On an iOS Simulator:** Press `i` in the terminal where the Expo server is running.
    -   **On an Android Emulator:** Press `a` in the terminal where the Expo server is running.

The app should now load on your chosen device or simulator.

## Project Structure (Key Files)

-   `App.tsx`: The main entry point of the React Native application, setting up navigation and global providers.
-   `index.ts`: Registers the root component for Expo.
-   `src/navigation/AppNavigator.tsx`: Defines the navigation stack for the application.
-   `src/screens/`: Contains the main views/screens of the application (e.g., `EntryScreen`, `NearbyUsersScreen`, `PrivateChatScreen`).
-   `src/components/`: Houses reusable UI components (e.g., `PrivateMessageInput`, `PrivateMessageList`, `PrivateMessageItem`).
-   `src/store/chatStore.ts`: Implements the Zustand store for managing global application state related to chat and user data.
-   `src/types.ts`: Contains TypeScript interface definitions for data structures used throughout the app.
-   `nativewind-env.d.ts`, `global.css`: Configuration files for NativeWind, enabling Tailwind CSS classes.

## Technologies Used

-   **React Native:** For building native mobile applications using JavaScript/TypeScript.
-   **Expo:** A framework and platform for universal React applications.
-   **TypeScript:** For type-safe JavaScript development.
-   **NativeWind:** Integrates Tailwind CSS into React Native for utility-first styling.
-   **React Navigation:** For handling navigation between different screens.
-   **Zustand:** A small, fast, and scalable bear-necessities state-management solution.
-   **`react-native-safe-area-context`:** Handles safe area insets for different devices.
-   **`react-native-gesture-handler`:** Provides native-driven gesture management.
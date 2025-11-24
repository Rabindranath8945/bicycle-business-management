// components/AppShell.tsx
import React, { useState, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Sidebar from "./SideBar";
import { SidebarContext } from "../context/SidebarContext";
import { SIDEBAR_WIDTH } from "../constants/layout";

export default function AppShell({ children }: any) {
  const [open, setOpen] = useState(false);

  // Sidebar starts hidden at -SIDEBAR_WIDTH
  const slideX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  const toggleSidebar = () => {
    if (open) {
      // close
      Animated.timing(slideX, {
        toValue: -SIDEBAR_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }).start(() => setOpen(false));
    } else {
      // open
      setOpen(true);
      Animated.timing(slideX, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <SidebarContext.Provider value={{ toggleSidebar }}>
      <View style={styles.container}>
        {/* Sidebar (animated translateX) */}
        <Animated.View
          style={[
            styles.sidebarContainer,
            { transform: [{ translateX: slideX }] },
          ]}
        >
          <Sidebar closeSidebar={toggleSidebar} />
        </Animated.View>

        {/* Main content (does NOT slide) */}
        <View style={styles.mainArea}>{children}</View>
      </View>
    </SidebarContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  sidebarContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 300,
    backgroundColor: "#fff",
    // smooth shadow for sidebar
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 8,
    elevation: 12,
  },
  mainArea: {
    flex: 1,
    zIndex: 100,
    backgroundColor: "#fff",
  },
});

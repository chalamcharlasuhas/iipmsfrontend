import { Stack } from "expo-router";
import { UserProvider } from '../contexts/UserContext'; // Import UserProvider

export default function Layout() {
  
  return (
    <UserProvider>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      <Stack.Screen name="dashboard" options={{ title: "dashboard", headerShown: false }} />
      {/* <Stack.Screen name="timesheet" options={{ title: "timesheet", headerShown: false }} /> */}
      <Stack.Screen name="timesheet" options={{ title: "timesheet", headerShown: false }} />
      <Stack.Screen name="leave" options={{ title: "leave", headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: "profile", headerShown: false }} />
      <Stack.Screen name="leavestatus" options={{ title: "leavestatus", headerShown: false }} />
      <Stack.Screen name="managerdashboard" options={{ title: "managerdashboard", headerShown: false }} />
      <Stack.Screen name="admindashboard" options={{ title: "admindashboard", headerShown: false }} />
      <Stack.Screen name="attendance" options={{ title: "attendance", headerShown: false }} />
      <Stack.Screen name="employeedetails" options={{ title: "employeedetails", headerShown: false }} />
      <Stack.Screen name="leavedecisions" options={{ title: "leavedecisions", headerShown: false }} />
      <Stack.Screen name="employeetasks" options={{ title: "employeetasks", headerShown: false }} />
      <Stack.Screen name="employeeattend" options={{ title: "employeeattend", headerShown: false }} />
      <Stack.Screen name="employeeregister" options={{ title: "employeeregister", headerShown: false }} />
      <Stack.Screen name="adminemployee" options={{ title: "adminemployee", headerShown: false }} />
      <Stack.Screen name="forget" options={ { title: "forget", headerShown: false }} />
      <Stack.Screen name="ViewAssignedEmployees" options={{ title: "ViewAssignedEmployees", headerShown: false }} />
      <Stack.Screen name="ManageAssignments" options={{ title: "ManageAssignments", headerShown: false }} />
      <Stack.Screen name="AssignEmployee" options={{ title: "AssignEmployee", headerShown: false }} />
      <Stack.Screen name="employeeselect" options={{ title: "employeeselect", headerShown: false }} />
      <Stack.Screen name="adminresetpass" options={{ title: "adminresetpass", headerShown: false }} />
      <Stack.Screen name="EditProfile" options={{ title: "EditProfile", headerShown: false }} />
      </Stack>
    </UserProvider>

  );
}
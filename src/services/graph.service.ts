import { GraphUser, GroupType } from "@/types/auth";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

const GROUP_IDS = {
  administrator: "e82b0ec4-6b93-4680-ba79-a01a472aedcc",
  coordinator: "fbd7a19c-a824-4e22-9848-ae1083af7f24",
  senior_manager: "0caacdf7-cea9-4d7c-a8be-123bf6720694",
  investigator: "a1fa7c32-2ac8-4998-9440-4b2c1a017f04",
  reviewer: "28c51aee-1d9e-45c9-9f02-bf588d478c69",
};

const baseUrl = "https://graph.microsoft.com/v1.0";

const graphApiClient = axios.create({
  baseURL: "/",
});

export function useGetMsGraphGroupMembers(): UseQueryResult<
  GraphUser[],
  Error
> {
  return useQuery({
    queryKey: ["groupMembers"],
    queryFn: getGroupMembers,
  });
}

export const getGroupIdByType = (groupType: GroupType): string => {
  const groupIds: Record<GroupType, string> = {
    administrator: "e82b0ec4-6b93-4680-ba79-a01a472aedcc",
    coordinator: "fbd7a19c-a824-4e22-9848-ae1083af7f24",
    "senior manager": "0caacdf7-cea9-4d7c-a8be-123bf6720694",
    investigator: "a1fa7c32-2ac8-4998-9440-4b2c1a017f04",
    reviewer: "28c51aee-1d9e-45c9-9f02-bf588d478c69",
  };
  return groupIds[groupType];
};

export const getGroupMembers = async (): Promise<GraphUser[]> => {
  try {
    // Fetch members from both groups
    const [
      adminResponse,
      coordinatorResponse,
      senior_managerResponse,
      investigatorResponse,
      reviewerResponse,
    ] = await Promise.all([
      graphApiClient.get(`/api/users/staff?groupId=${GROUP_IDS.administrator}`),
      graphApiClient.get(`/api/users/staff?groupId=${GROUP_IDS.coordinator}`),
      graphApiClient.get(
        `/api/users/staff?groupId=${GROUP_IDS.senior_manager}`
      ),
      graphApiClient.get(`/api/users/staff?groupId=${GROUP_IDS.investigator}`),
      graphApiClient.get(`/api/users/staff?groupId=${GROUP_IDS.reviewer}`),
    ]);

    const adminMembers = adminResponse.data.map((user: GraphUser) => ({
      ...user,
      groupId: GROUP_IDS.administrator,
      role: "Administrator",
    }));

    const coordinatorMembers = coordinatorResponse.data.map(
      (user: GraphUser) => ({
        ...user,
        groupId: GROUP_IDS.coordinator,
        role: "Coordinator",
      })
    );

    const senior_managerMembers = senior_managerResponse.data.map(
      (user: GraphUser) => ({
        ...user,
        groupId: GROUP_IDS.senior_manager,
        role: "Senior Manager",
      })
    );

    const investigatorMembers = investigatorResponse.data.map(
      (user: GraphUser) => ({
        ...user,
        groupId: GROUP_IDS.investigator,
        role: "Investicator",
      })
    );

    const reviwerMembers = reviewerResponse.data.map((user: GraphUser) => ({
      ...user,
      groupId: GROUP_IDS.reviewer,
      role: "Reviewer",
    }));

    return [
      ...adminMembers,
      ...coordinatorMembers,
      ...senior_managerMembers,
      ...investigatorMembers,
      ...reviwerMembers,
    ];
  } catch (error) {
    console.error("Error fetching group members:", error);
    throw new Error("Failed to fetch group members");
  }
};

export const searchUsers = async (query: string): Promise<GraphUser[]> => {
  try {
    const response = await graphApiClient.get(
      `/api/users/staff/search?query=${query}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Failed to search users");
  }
};

// ✅ Add user to group
export const addUserToGroup = async (groupId: string, userId: string) => {
  const body = {
    "@odata.id": `${baseUrl}/directoryObjects/${userId}`,
  };

  const response = await graphApiClient.post(`/api/users/staff`, {
    payload: body,
    groupId,
  });

  return response.data;
};

export const removeUserFromGroup = async (groupId: string, userId: string) => {
  const response = await graphApiClient.delete(
    `/api/users/staff?userId=${userId}&groupId=${groupId}`
  );

  return response.data;
};

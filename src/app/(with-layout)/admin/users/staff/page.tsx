"use client";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  Spinner,
  Alert,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledDropdown,
} from "reactstrap";
import { UserPlus, Trash2, Mail, Building } from "lucide-react";
import { GroupType } from "src/types/auth";
import {
  useGetMsGraphGroupMembers,
  removeUserFromGroup,
  getGroupIdByType,
} from "@/services/graph.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import BreadCrumb from "@common/BreadCrumb";
import MicrosoftGraphModal from "src/components/auth/MirosoftGraphModal";
import UserManagementTable from "src/components/Tables/UserManagementTable";

const UserManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<GroupType | "all">("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
    groupId: string;
    groupType: GroupType;
  }>({
    isOpen: false,
    userId: "",
    userName: "",
    groupId: "",
    groupType: "administrator",
  });
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } =
    useGetMsGraphGroupMembers();
  const queryClient = useQueryClient();

  // Remove user mutation
  const removeUserMutation = useMutation({
    mutationFn: async ({
      userId,
      groupId,
    }: {
      userId: string;
      groupId: string;
    }) => {
      return await removeUserFromGroup(groupId, userId);
    },
    onSuccess: (_, variables) => {
      toast.success("User removed from group successfully");
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
      setDeleteModal({ ...deleteModal, isOpen: false });
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove user: ${error.message}`);
    },
  });

  const determineGroupType = (groupId: string): GroupType => {
    // Get all group IDs for comparison
    const groupIds = {
      administrator: "e82b0ec4-6b93-4680-ba79-a01a472aedcc",
      coordinator: "fbd7a19c-a824-4e22-9848-ae1083af7f24",
      "senior manager": "0caacdf7-cea9-4d7c-a8be-123bf6720694",
      investigator: "a1fa7c32-2ac8-4998-9440-4b2c1a017f04",
      reviewer: "28c51aee-1d9e-45c9-9f02-bf588d478c69",
    };

    // Find which group this ID matches
    const entry = Object.entries(groupIds).find(([_, id]) => id === groupId);

    // Return the group type or default to "administrator"
    return (entry?.[0] as GroupType) || "administrator";
  };

  // Group options
  const groupOptions: {
    value: GroupType | "all";
    label: string;
    color: string;
  }[] = [
    { value: "all", label: "All Groups", color: "secondary" },
    { value: "administrator", label: "Administrators", color: "danger" },
    { value: "coordinator", label: "Coordinators", color: "primary" },
    { value: "senior manager", label: "Senior Managers", color: "info" },
    { value: "investigator", label: "Investigators", color: "warning" },
    { value: "reviewer", label: "Reviewers", color: "success" },
  ];

  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      console.log("No data or data is not an array");
      return [];
    }
    const userMap = new Map();

    data.forEach((item, index) => {
      const userId = item.id;
      const groupId = item.groupId;
      const groupType = determineGroupType(groupId as string);

      if (!userMap.has(userId)) {
        userMap.set(userId, {
          id: userId,
          displayName: item.displayName || "Unknown User",
          mail: item.mail || "",
          userPrincipalName: item.userPrincipalName || "",
          jobTitle: item.jobTitle,
          officeLocation: item.officeLocation,
          givenName: item.givenName,
          surname: item.surname,
          businessPhones: item.businessPhones,
          groups: [groupType],
          groupIds: [groupId],
          roles: [item.role || groupType],
        });
      } else {
        const existingUser = userMap.get(userId);
        // Only add unique groups
        if (!existingUser.groups.includes(groupType)) {
          existingUser.groups.push(groupType);
          existingUser.groupIds.push(groupId);
          existingUser.roles.push(item.role || groupType);
        }
      }
    });

    let users = Array.from(userMap.values());

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      users = users.filter(user => {
        const matches =
          user.displayName?.toLowerCase().includes(term) ||
          user.mail?.toLowerCase().includes(term) ||
          user.userPrincipalName?.toLowerCase().includes(term) ||
          user.jobTitle?.toLowerCase().includes(term) ||
          user.department?.toLowerCase().includes(term);

        return matches;
      });
    }

    // Filter by selected group
    if (selectedGroup !== "all") {
      const initialCount = users.length;
      users = users.filter(user => user.groups.includes(selectedGroup));
      console.log(
        `Group filter filtered from ${initialCount} to ${users.length} users`
      );
    }

    // Sort alphabetically
    users.sort((a, b) => a.displayName.localeCompare(b.displayName));

    return users;
  }, [data, searchTerm, selectedGroup]);

  const handleRemoveUser = (
    userId: string,
    userName: string,
    groupType: GroupType
  ) => {
    const groupId = getGroupIdByType(groupType);
    setDeleteModal({
      isOpen: true,
      userId,
      userName,
      groupId,
      groupType,
    });
  };

  const confirmRemoveUser = () => {
    removeUserMutation.mutate({
      userId: deleteModal.userId,
      groupId: deleteModal.groupId,
    });
  };

  // Define table columns
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "displayName",
        header: "User",
        cell: ({ row }: any) => {
          const user = row.original;
          return (
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div
                  className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 40, height: 40 }}
                >
                  <span className="text-success fw-semibold">
                    {user.displayName?.charAt(0) || "U"}
                  </span>
                </div>
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-0">{user.displayName}</h6>
                <small className="text-muted">{user.userPrincipalName}</small>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "mail",
        header: "Email",
        cell: ({ row }: any) => {
          const user = row.original;
          return (
            <div className="d-flex align-items-center">
              <Mail size={16} className="me-2 text-muted" />
              {user.mail || "No email"}
            </div>
          );
        },
      },
      {
        accessorKey: "jobTitle",
        header: "Job Title",
        cell: ({ row }: any) => row.original.jobTitle || "-",
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }: any) => {
          const user = row.original;
          return user.department ? (
            <div className="d-flex align-items-center">
              <Building size={16} className="me-2 text-muted" />
              {user.department}
            </div>
          ) : (
            "-"
          );
        },
      },
      {
        accessorKey: "groups",
        header: "Groups",
        cell: ({ row }: any) => {
          const user = row.original;
          const groupOptions = [
            {
              value: "administrator",
              label: "Administrators",
              color: "danger",
            },
            { value: "coordinator", label: "Coordinators", color: "primary" },
            {
              value: "senior manager",
              label: "Senior Managers",
              color: "info",
            },
            { value: "investigator", label: "Investigators", color: "warning" },
            { value: "reviewer", label: "Reviewers", color: "success" },
          ];

          return (
            <div className="d-flex flex-wrap gap-1">
              {user.groups.map((group: any) => (
                <Badge
                  key={group}
                  color={
                    groupOptions.find(g => g.value === group)?.color as any
                  }
                  pill
                  className="cursor-pointer"
                  title={`Remove from ${group}`}
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveUser(user.id, user.displayName, group);
                  }}
                >
                  {group.charAt(0).toUpperCase()}
                  <Trash2
                    size={10}
                    className="ms-1"
                    style={{ marginTop: -1 }}
                  />
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: any) => {
          const user = row.original;
          return (
            <div className="text-end">
              <UncontrolledDropdown direction="start">
                <DropdownToggle color="light" size="sm" className="px-2">
                  ···
                </DropdownToggle>
                <DropdownMenu>
                  {user.groups.map((group: any) => (
                    <DropdownItem
                      key={group}
                      onClick={() =>
                        handleRemoveUser(user.id, user.displayName, group)
                      }
                      className="text-danger"
                    >
                      <Trash2 size={14} className="me-2" />
                      Remove from {group}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="User Management" pageTitle="Microsoft Graph" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title mb-0">
                        Microsoft 365 Group Members
                      </h5>
                      <p className="text-muted mb-0">
                        Manage users across different security groups
                      </p>
                    </div>
                    <Button
                      color="success"
                      onClick={() => setModalOpen(true)}
                      className="d-flex align-items-center gap-2"
                    >
                      <UserPlus size={16} />
                      Add User to Group
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <UserManagementTable
                    data={processedData}
                    columns={columns}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    onGroupChange={group =>
                      setSelectedGroup(group as GroupType | "all")
                    }
                    selectedGroup={selectedGroup}
                    groupOptions={groupOptions}
                    refetch={refetch}
                    showSearch={true}
                    showPagination={true}
                    pageSize={3}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Add User Modal */}
      <MicrosoftGraphModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        defaultGroupType={
          selectedGroup !== "all" ? selectedGroup : "administrator"
        }
        onSuccess={() => {
          refetch();
        }}
        title="Add User to Microsoft 365 Group"
        description="Search for users in your organization and add them to security groups"
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        toggle={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        centered
      >
        <ModalHeader
          toggle={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        >
          <Trash2 size={20} className="me-2 text-danger" />
          Remove User from Group
        </ModalHeader>
        <ModalBody>
          <Alert color="warning" className="mb-0">
            <h6 className="alert-heading">Are you sure?</h6>
            <p className="mb-0">
              You are about to remove <strong>{deleteModal.userName}</strong>{" "}
              from the{" "}
              <strong>
                {
                  groupOptions.find(g => g.value === deleteModal.groupType)
                    ?.label
                }
              </strong>{" "}
              group.
            </p>
          </Alert>
          <div className="mt-3">
            <p className="text-muted small">
              This action will immediately revoke the user's access to resources
              associated with this group.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
            disabled={removeUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={confirmRemoveUser}
            disabled={removeUserMutation.isPending}
            className="d-flex align-items-center gap-2"
          >
            {removeUserMutation.isPending ? (
              <>
                <Spinner size="sm" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Remove User
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default UserManagement;

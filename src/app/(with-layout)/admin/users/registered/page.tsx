"use client";

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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Spinner,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  UserPlus,
  User,
  Mail,
  Calendar,
  Shield,
  Key,
  Trash2,
  UserCheck,
  UserX,
  MoreVertical,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import UserManagementTable from "@/components/Tables/UserManagementTable";
import BreadCrumb from "@common/BreadCrumb";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useGetUsers,
  useToggleUserStatus,
  useGetRoles,
  useAssignRole,
  useRemoveRole,
  useDeleteRole,
} from "@/hooks/user.hook";
import CreateUserModal from "@/components/Users/CreateUserModal";
import ResetPasswordModal from "@/components/Users/ResetPasswordModal";
import ManageUserRolesModal from "@/components/Users/ManageUserRolesModal";
import CreateRoleModal from "@/components/Users/CreateRoleModal";
import UserDetailsModal from "src/components/Users/UserDetailsModal";
import DeleteModal from "src/components/Common/DeleteModal";

const UsersManagementPage = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [manageRolesModalOpen, setManageRolesModalOpen] = useState(false);
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [deleteRoleModalOpen, setDeleteRoleModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const [confirmDeleteRoleModal, setConfirmDeleteRoleModal] = useState(false);
  const [userRoleToDelete, setUserRoleToDelete] = useState({
    userId: "",
    roleName: "",
  });

  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any>(null);

  const handleEditUser = (user: any) => {
    setUserToEdit(user);
    setIsEditUserModalOpen(true);
  };

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsers();
  const { data: roles = [] } = useGetRoles();
  const toggleUserStatusMutation = useToggleUserStatus();
  const assignRoleMutation = useAssignRole();
  const removeRoleMutation = useRemoveRole();
  const deleteRoleMutation = useDeleteRole();

  // Define table columns
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "User",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div
                  className={`avatar-sm rounded-circle d-flex align-items-center justify-content-center ${
                    user.isActive ? "bg-success-subtle" : "bg-danger-subtle"
                  }`}
                  style={{ width: 40, height: 40 }}
                >
                  <span
                    className={`fw-semibold ${user.isActive ? "text-success" : "text-danger"}`}
                  >
                    {user.fullName?.charAt(0) || "U"}
                  </span>
                </div>
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-0">{user.fullName}</h6>
                <small className="text-muted">
                  <Mail size={12} className="me-1" />
                  {user.email}
                </small>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => row.original.email,
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone",
        cell: ({ row }) => row.original.phoneNumber || "-",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="d-flex align-items-center gap-2">
              <Badge color={user.isActive ? "success" : "danger"} pill>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
              {user.emailConfirmed ? (
                <Badge color="success" pill title="Email Verified">
                  <Mail size={10} />
                </Badge>
              ) : (
                <Badge color="warning" pill title="Email Not Verified">
                  !
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="d-flex flex-wrap gap-1">
              {user.roles?.map((role: string) => (
                <Badge
                  key={role}
                  color="primary"
                  pill
                  className="cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveRole(user.id, role);
                  }}
                  title={`Click to remove ${role} role`}
                >
                  {role}
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
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt);
          return (
            <div className="text-muted small">
              <Calendar size={12} className="me-1" />
              {date.toLocaleDateString()}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="d-flex gap-1">
              <UncontrolledDropdown direction="start">
                <DropdownToggle color="light" size="sm" className="px-2">
                  <MoreVertical size={16} />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => handleToggleStatus(user.id, !user.isActive)}
                    className={user.isActive ? "text-danger" : "text-success"}
                  >
                    {user.isActive ? (
                      <>
                        <UserX size={14} className="me-2" />
                        Disable User
                      </>
                    ) : (
                      <>
                        <UserCheck size={14} className="me-2" />
                        Enable User
                      </>
                    )}
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleManageRoles(user)}
                    className="text-primary"
                  >
                    <Shield size={14} className="me-2" />
                    Manage Roles
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleResetPassword(user)}
                    className="text-warning"
                  >
                    <Key size={14} className="me-2" />
                    Reset Password
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem
                    onClick={() => handleViewDetails(user)}
                    className="text-info"
                  >
                    <User size={14} className="me-2" />
                    View Details
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          );
        },
      },
    ],
    []
  );

  // Filter users based on selected filter
  const filteredUsers = useMemo(() => {
    if (selectedFilter === "all") return users;
    if (selectedFilter === "active") return users.filter(user => user.isActive);
    if (selectedFilter === "inactive")
      return users.filter(user => !user.isActive);
    return users.filter(user => user.roles?.includes(selectedFilter));
  }, [users, selectedFilter]);

  // Filter options
  const filterOptions = useMemo(() => {
    const baseFilters = [
      { value: "all", label: "All Users", color: "secondary" },
      { value: "active", label: "Active Users", color: "success" },
      { value: "inactive", label: "Inactive Users", color: "danger" },
    ];

    const roleFilters = roles.map(role => ({
      value: role.name,
      label: `${role.name} (${role.userCount || 0})`,
      color: "primary",
    }));

    return [...baseFilters, ...roleFilters];
  }, [roles]);

  // Handlers
  const handleToggleStatus = (userId: string, isActive: boolean) => {
    if (
      window.confirm(
        `Are you sure you want to ${isActive ? "enable" : "disable"} this user?`
      )
    ) {
      toggleUserStatusMutation.mutate({ userId, isActive });
    }
  };

  const handleResetPassword = (user: any) => {
    setSelectedUser(user);
    setResetPasswordModalOpen(true);
  };

  const handleManageRoles = (user: any) => {
    setSelectedUser(user);
    setManageRolesModalOpen(true);
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
  };

  const handleAssignRole = (userId: string, roleName: string) => {
    assignRoleMutation.mutate(
      { userId, roleName },
      {
        onSuccess: () => {
          const updatedUser = users.find(x => x.id === userId);
          setSelectedUser((prev: any) => ({
            ...prev,
            roles: [...(updatedUser?.roles as any)],
          }));
        },
      }
    );
  };

  const handleRemoveRole = (userId: string, roleName: string) => {
    setUserRoleToDelete({
      userId,
      roleName,
    });
    setConfirmDeleteRoleModal(true);
    // if (window.confirm(`Remove ${roleName} role from this user?`)) {
    //   removeRoleMutation.mutate(
    //     { userId, roleName },
    //     {
    //       onSuccess: () => {
    //         setManageRolesModalOpen(false);
    //       },
    //     }
    //   );
    // }
  };

  const removeUserRole = () => {
    removeRoleMutation.mutate(
      { userId: userRoleToDelete.userId, roleName: userRoleToDelete.roleName },
      {
        onSuccess: () => {
          setConfirmDeleteRoleModal(false);
          const updatedUser = users.find(x => x.id === userRoleToDelete.userId);
          setSelectedUser((prev: any) => ({
            ...prev,
            roles: updatedUser?.roles.filter(
              x => x === userRoleToDelete.roleName
            ),
          }));
        },
      }
    );
  };

  const handleDeleteRole = (roleName: string) => {
    setRoleToDelete(roleName);
    setDeleteRoleModalOpen(true);
  };

  const confirmDeleteRole = () => {
    deleteRoleMutation.mutate(roleToDelete, {
      onSuccess: () => {
        setDeleteRoleModalOpen(false);
        setRoleToDelete("");
      },
    });
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="User Management" pageTitle="Administration" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title mb-0">Manage Users & Roles</h5>
                      <p className="text-muted mb-0">
                        Create, update, and manage user accounts and roles
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        color="primary"
                        onClick={() => setCreateRoleModalOpen(true)}
                        className="d-flex align-items-center gap-2"
                      >
                        <Shield size={16} />
                        Create Role
                      </Button>
                      <Button
                        color="success"
                        onClick={() => setCreateUserModalOpen(true)}
                        className="d-flex align-items-center gap-2"
                      >
                        <UserPlus size={16} />
                        Create User
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <UserManagementTable
                    data={filteredUsers}
                    columns={columns}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    onGroupChange={setSelectedFilter}
                    selectedGroup={selectedFilter}
                    groupOptions={filterOptions}
                    refetch={refetch}
                    showSearch={true}
                    showPagination={true}
                    pageSize={10}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Roles Card */}
          <Row className="mt-3">
            <Col lg={12}>
              <Card>
                <CardHeader className="border-0">
                  <h5 className="card-title mb-0">System Roles</h5>
                  <p className="text-muted mb-0">Manage application roles</p>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <div className="text-center py-3">
                      <Spinner size="sm" />
                      <span className="ms-2">Loading roles...</span>
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {roles.map(role => (
                        <Badge
                          key={role.name}
                          color="primary"
                          pill
                          className="p-2 d-flex align-items-center gap-2"
                          style={{ fontSize: "0.9rem" }}
                        >
                          <Shield size={14} />
                          {role.name}
                          <Badge color="danger" pill className="ms-1">
                            {role.userCount || 0}
                          </Badge>
                          <Button
                            color="link"
                            size="sm"
                            className="p-0 text-danger"
                            onClick={() => handleDeleteRole(role.name)}
                            disabled={deleteRoleMutation.isPending}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </Badge>
                      ))}
                      {roles.length === 0 && (
                        <Alert color="info" className="mb-0">
                          No roles defined. Create your first role to get
                          started.
                        </Alert>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Creating new user modal */}
      <CreateUserModal
        isOpen={createUserModalOpen}
        toggle={() => setCreateUserModalOpen(false)}
        roles={roles}
        onSuccess={() => {
          refetch();
          setCreateUserModalOpen(false);
          setUserToEdit(null);
        }}
      />

      {/* Edit user modal */}
      <CreateUserModal
        isOpen={isEditUserModalOpen}
        toggle={() => setIsEditUserModalOpen(false)}
        roles={roles}
        onSuccess={() => {
          refetch();
          setIsEditUserModalOpen(false);
          setUserToEdit(null);
        }}
        userToEdit={userToEdit}
        setSelectedUser={setSelectedUser}
      />

      <ResetPasswordModal
        isOpen={resetPasswordModalOpen}
        toggle={() => setResetPasswordModalOpen(false)}
        user={selectedUser}
        onSuccess={() => {
          setResetPasswordModalOpen(false);
          // setSelectedUser(null);
        }}
      />

      <ManageUserRolesModal
        isOpen={manageRolesModalOpen}
        toggle={() => setManageRolesModalOpen(false)}
        user={selectedUser}
        roles={roles}
        onAssignRole={handleAssignRole}
        onRemoveRole={handleRemoveRole}
        onSuccess={() => {
          refetch();
          setManageRolesModalOpen(false);
          setSelectedUser(null);
        }}
      />

      <CreateRoleModal
        isOpen={createRoleModalOpen}
        toggle={() => setCreateRoleModalOpen(false)}
        onSuccess={() => {
          refetch();
          setCreateRoleModalOpen(false);
        }}
      />

      <UserDetailsModal
        isOpen={!!selectedUser}
        user={selectedUser}
        onEdit={handleEditUser}
        onManageRoles={() => {
          if (selectedUser) {
            setManageRolesModalOpen(true);
          }
        }}
        onResetPassword={() => {
          if (selectedUser) {
            setResetPasswordModalOpen(true);
          }
        }}
        onToggleStatus={() => {
          if (
            selectedUser &&
            window.confirm(
              `Are you sure you want to ${selectedUser.isActive ? "disable" : "enable"} ${selectedUser.fullName}?`
            )
          ) {
            toggleUserStatusMutation
              .mutateAsync({
                userId: selectedUser.id,
                isActive: !selectedUser.isActive,
              })
              .then(response => {
                setSelectedUser((prev: any) => ({
                  ...prev,
                  isActive: response.isActive,
                }));
              });
          }
        }}
        toggle={() => {
          setSelectedUser(null);
        }}
      />

      <DeleteModal
        show={confirmDeleteRoleModal}
        onDeleteClick={removeUserRole}
        onCloseClick={() => setConfirmDeleteRoleModal(false)}
      />
      {/* Delete Role Confirmation Modal */}
      <Modal
        isOpen={deleteRoleModalOpen}
        toggle={() => setDeleteRoleModalOpen(false)}
        centered
      >
        <ModalHeader toggle={() => setDeleteRoleModalOpen(false)}>
          <Trash2 size={20} className="me-2 text-danger" />
          Delete Role
        </ModalHeader>
        <ModalBody>
          <Alert color="danger" className="mb-0">
            <h6 className="alert-heading">Warning!</h6>
            <p className="mb-0">
              You are about to delete the role <strong>"{roleToDelete}"</strong>
              . This action cannot be undone.
            </p>
            <hr />
            <p className="mb-0 small">
              Users assigned to this role will lose their permissions. Make sure
              to reassign users to other roles before proceeding.
            </p>
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setDeleteRoleModalOpen(false)}
            disabled={deleteRoleMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={confirmDeleteRole}
            disabled={deleteRoleMutation.isPending}
            className="d-flex align-items-center gap-2"
          >
            {deleteRoleMutation.isPending ? (
              <>
                <Spinner size="sm" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Role
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default UsersManagementPage;

"use client";

import React from "react";
import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Alert,
  Spinner,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  InputGroup,
  InputGroupText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import {
  Search,
  Filter,
  Plus,
  X,
  User,
  Users,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";
import { GraphUser, GroupType } from "src/types/auth";
import {
  addUserToGroup,
  removeUserFromGroup,
  useGetMsGraphGroupMembers,
  searchUsers,
} from "@/services/graph.service";
import { toast } from "react-toastify";

function GraphModal2() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GraphUser[]>([]);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<GraphUser | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedGroup, setSelectedGroup] =
    useState<GroupType>("administrator");

  const { data, isLoading, error, isError, refetch } =
    useGetMsGraphGroupMembers();

  const queryClient = useQueryClient();

  const addUserMutation = useMutation({
    mutationFn: ({
      userId,
      groupType,
    }: {
      userId: string;
      groupType: GroupType;
    }) => {
      const groupId = getGroupIdByType(groupType);
      return addUserToGroup(groupId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
      setSuccessMessage("User added successfully!");
      setErrorMessage("");
      setModalOpen(false);
      setSelectedUser(null);
      setSearchQuery("");
      setSearchResults([]);
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error: Error) => {
      setErrorMessage(`Failed to add user: ${error.message}`);
      setSuccessMessage("");
    },
  });

  const removeUserMutation = useMutation({
    mutationFn: ({ userId, groupId }: { userId: string; groupId: string }) => {
      setRemovingUserId(userId);
      return removeUserFromGroup(groupId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
      setErrorMessage("");
      toast.success("User removed successfully!");
    },
    onError: (error: Error) => {
      setErrorMessage(`Failed to remove user: ${error.message}`);
      setSuccessMessage("");
    },
    onSettled: () => {
      setRemovingUserId(null);
    },
  });

  const handleAddUser = () => {
    if (!selectedUser || !selectedUser.mail) {
      setErrorMessage("Please select a user first");
      return;
    }
    addUserMutation.mutate({
      userId: selectedUser.id,
      groupType: selectedGroup,
    });
  };

  const searchUsersMutation = useMutation({
    mutationFn: (query: string) => searchUsers(query),
    onSuccess: data => {
      setSearchResults(data);
    },
    onError: (error: Error) => {
      setErrorMessage(`Search failed: ${error.message}`);
    },
  });

  const getGroupIdByType = (groupType: GroupType): string => {
    const groupIds = {
      administrator: "e82b0ec4-6b93-4680-ba79-a01a472aedcc",
      coordinator: "fbd7a19c-a824-4e22-9848-ae1083af7f24",
      "senior manager": "0caacdf7-cea9-4d7c-a8be-123bf6720694",
      investigator: "a1fa7c32-2ac8-4998-9440-4b2c1a017f04",
      reviewer: "28c51aee-1d9e-45c9-9f02-bf588d478c69",
    };
    return groupIds[groupType];
  };

  const getGroupDisplayName = (groupType: GroupType): string => {
    return groupType === "administrator" ? "Administrator" : "SME";
  };

  const determineGroupType = (groupId: string): GroupType => {
    if (groupId === getGroupIdByType("administrator")) {
      return "administrator";
    } else if (groupId === getGroupIdByType("coordinator")) {
      return "coordinator";
    } else if (groupId === getGroupIdByType("investigator")) {
      return "investigator";
    } else if (groupId === getGroupIdByType("reviewer")) {
      return "reviewer";
    }
    return "senior manager";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 3) {
      setErrorMessage("Please enter at least 3 characters to search");
      return;
    }
    searchUsersMutation.mutate(searchQuery.trim());
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setSelectedUser(null);
    }
  };
  return (
    <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
      <ModalHeader toggle={toggleModal}>
        <div className="d-flex flex-row gap-2 items-center">
          <UserPlus className="me-2" size={20} />
          Add User to Group
        </div>
      </ModalHeader>
      <ModalBody>
        {/* User Search */}
        <Form onSubmit={handleSearch} className="mb-3">
          <FormGroup>
            <Label for="userSearch">Search Users</Label>
            <InputGroup>
              <Input
                type="text"
                id="userSearch"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
              />
              <Button
                type="submit"
                color="primary"
                disabled={searchUsersMutation.isPending}
              >
                {searchUsersMutation.isPending ? (
                  <Spinner size="sm" />
                ) : (
                  <Search size={16} />
                )}
              </Button>
            </InputGroup>
            <div className="form-text">
              Enter at least 3 characters to search
            </div>
          </FormGroup>
        </Form>

        {/* Search Results */}
        {searchUsersMutation.isPending && (
          <div className="text-center py-3">
            <Spinner size="sm" className="me-2" />
            Searching...
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mb-3">
            <h6>Search Results:</h6>
            <ListGroup>
              {searchResults.map(user => (
                <ListGroupItem
                  key={user.id}
                  action
                  active={selectedUser?.id === user.id}
                  onClick={() => setSelectedUser(user)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <strong>{user.displayName}</strong>
                      <br />
                      <small className="">
                        {user.mail || user.userPrincipalName}
                      </small>
                    </div>
                    {selectedUser?.id === user.id && (
                      <Badge color="info" pill>
                        Selected
                      </Badge>
                    )}
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
        )}

        {/* Selected User and Group Selection */}
        {selectedUser && (
          <div>
            <h6>Selected User:</h6>
            <Card className="mb-3 bg-light">
              <CardBody className="py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{selectedUser.displayName}</strong>
                    <br />
                    <small className="">
                      {selectedUser.mail || selectedUser.userPrincipalName}
                    </small>
                  </div>
                  <Button
                    color="link"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                    className="text-danger"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardBody>
            </Card>

            <FormGroup>
              <Label for="modalGroupSelect">Select Group</Label>
              <Input
                type="select"
                id="modalGroupSelect"
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value as GroupType)}
              >
                <option value="admin">Admin Group</option>
                <option value="sme">SME Group</option>
              </Input>
            </FormGroup>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={handleAddUser}
          disabled={addUserMutation.isPending || !selectedUser}
          className="d-flex align-items-center"
        >
          {addUserMutation.isPending ? (
            <>
              <Spinner size="sm" className="me-2" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="me-2" size={16} />
              Add to Group
            </>
          )}
        </Button>
        <Button color="secondary" onClick={toggleModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default GraphModal2;

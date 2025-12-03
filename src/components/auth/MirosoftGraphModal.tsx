// components/GraphModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Badge,
  Card,
  CardBody,
  Spinner,
  Alert,
} from "reactstrap";
import { Search, Plus, X, UserPlus } from "lucide-react";
import { GraphUser, GroupType } from "src/types/auth";
import {
  searchUsers,
  getGroupIdByType,
  addUserToGroup,
  useGetMsGraphGroupMembers,
} from "@/services/graph.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface GraphModalProps {
  isOpen: boolean;
  toggle: () => void;
  defaultGroupType?: GroupType;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

const MicrosoftGraphModal: React.FC<GraphModalProps> = ({
  isOpen,
  toggle,
  defaultGroupType = "administrator",
  onSuccess,
  title = "Add User to Group",
  description = "Search for users and add them to the selected group",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GraphUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<GraphUser | null>(null);
  const [selectedGroup, setSelectedGroup] =
    useState<GroupType>(defaultGroupType);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const queryClient = useQueryClient();
  const { refetch: refetchGroupMembers } = useGetMsGraphGroupMembers();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetState();
    } else {
      setSelectedGroup(defaultGroupType);
    }
  }, [isOpen, defaultGroupType]);

  const resetState = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUser(null);
    setSearchError("");
    setIsSearching(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim().length < 3) {
      setSearchError("Please enter at least 3 characters to search");
      return;
    }

    setSearchError("");
    setIsSearching(true);

    try {
      const users = await searchUsers(searchQuery.trim());
      setSearchResults(users);

      if (users.length === 0) {
        setSearchError("No users found matching your search");
      }
    } catch (error: any) {
      setSearchError(`Search failed: ${error.message}`);
      toast.error("Failed to search users");
    } finally {
      setIsSearching(false);
    }
  };

  const addUserMutation = useMutation({
    mutationFn: async ({
      userId,
      groupType,
    }: {
      userId: string;
      groupType: GroupType;
    }) => {
      const groupId = getGroupIdByType(groupType);
      return await addUserToGroup(groupId, userId);
    },
    onSuccess: (_, variables) => {
      toast.success(`User added to ${variables.groupType} group successfully!`);

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
      refetchGroupMembers();

      // Call success callback if provided
      if (onSuccess) onSuccess();

      // Close modal
      toggle();
    },
    onError: (error: Error) => {
      toast.error(`Failed to add user: ${error.message}`);
    },
  });

  const handleAddUser = () => {
    if (!selectedUser || !selectedUser.mail) {
      toast.error("Please select a user first");
      return;
    }

    if (!selectedGroup) {
      toast.error("Please select a group");
      return;
    }

    addUserMutation.mutate({
      userId: selectedUser.id,
      groupType: selectedGroup,
    });
  };

  const groupOptions: { value: GroupType; label: string }[] = [
    { value: "administrator", label: "Administrators" },
    { value: "coordinator", label: "Coordinators" },
    { value: "senior manager", label: "Senior Managers" },
    { value: "investigator", label: "Investigators" },
    { value: "reviewer", label: "Reviewers" },
  ];

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="border-0 pb-1">
        <div className="d-flex align-items-center gap-2">
          <UserPlus size={20} />
          <div>
            <h5 className="mb-0">{title}</h5>
            {description && (
              <p className="text-muted small mb-0 mt-1">{description}</p>
            )}
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        {/* Search Section */}
        <Form onSubmit={handleSearch} className="mb-4">
          <FormGroup>
            <Label for="userSearch" className="fw-semibold">
              Search Users in Microsoft Graph
            </Label>
            <InputGroup>
              <Input
                type="text"
                id="userSearch"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or username..."
                disabled={addUserMutation.isPending}
                className="border-end-0"
              />
              <Button
                type="submit"
                color="primary"
                disabled={isSearching || addUserMutation.isPending}
                className="px-3"
              >
                {isSearching ? (
                  <Spinner size="sm" className="me-1" />
                ) : (
                  <Search size={16} />
                )}
              </Button>
            </InputGroup>
            <div className="form-text text-muted mt-1">
              Enter at least 3 characters to search across your organization
            </div>
            {searchError && (
              <Alert color="danger" className="mt-2 py-2 small" fade={false}>
                {searchError}
              </Alert>
            )}
          </FormGroup>
        </Form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-4">
            <h6 className="fw-semibold mb-2">Search Results:</h6>
            <ListGroup flush className="max-h-40 overflow-auto">
              {searchResults.map(user => (
                <ListGroupItem
                  key={user.id}
                  action
                  active={selectedUser?.id === user.id}
                  onClick={() => setSelectedUser(user)}
                  style={{ cursor: "pointer" }}
                  className="border-0 py-2"
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center">
                        <div
                          className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: 36, height: 36 }}
                        >
                          <span className="text-primary fw-semibold">
                            {user.displayName?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <strong className="d-block">
                            {user.displayName}
                          </strong>
                          <small className="text-muted d-block">
                            {user.mail || user.userPrincipalName}
                          </small>
                          {user.jobTitle && (
                            <small className="text-muted">
                              {user.jobTitle}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedUser?.id === user.id && (
                      <Badge color="success" pill className="ms-2">
                        Selected
                      </Badge>
                    )}
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
        )}

        {/* Selected User Preview */}
        {selectedUser && (
          <div className="mb-4">
            <h6 className="fw-semibold mb-2">Selected User:</h6>
            <Card className="border border-success bg-success-subtle">
              <CardBody className="py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: 40, height: 40 }}
                    >
                      <span className="text-white fw-semibold">
                        {selectedUser.displayName?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <strong className="d-block">
                        {selectedUser.displayName}
                      </strong>
                      <small className="text-muted">
                        {selectedUser.mail || selectedUser.userPrincipalName}
                      </small>
                    </div>
                  </div>
                  <Button
                    color="link"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                    className="text-danger p-0"
                    disabled={addUserMutation.isPending}
                  >
                    <X size={20} />
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Group Selection */}
        <FormGroup>
          <Label for="groupSelect" className="fw-semibold">
            Select Group
          </Label>
          <Input
            type="select"
            id="groupSelect"
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value as GroupType)}
            disabled={addUserMutation.isPending}
            className="form-select"
          >
            {groupOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Input>
          <div className="form-text text-muted mt-1">
            The user will be added to the selected Microsoft 365 group
          </div>
        </FormGroup>

        {/* Status Indicators */}
        {addUserMutation.isPending && (
          <Alert color="info" className="mt-3">
            <Spinner size="sm" className="me-2" />
            Adding user to group...
          </Alert>
        )}
      </ModalBody>

      <ModalFooter className="border-top-0 pt-0">
        <Button
          color="secondary"
          onClick={toggle}
          disabled={addUserMutation.isPending}
          className="px-4"
        >
          Cancel
        </Button>
        <Button
          color="success"
          onClick={handleAddUser}
          disabled={addUserMutation.isPending || !selectedUser}
          className="px-4 d-flex align-items-center gap-2"
        >
          {addUserMutation.isPending ? (
            <>
              <Spinner size="sm" />
              Adding...
            </>
          ) : (
            <>
              <Plus size={16} />
              Add to Group
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default MicrosoftGraphModal;

"use client";
import React from "react";
import Link from "next/link";

import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

// import { useEffect } from "react";

//import images
const avatar1 = "/images/users/avatar-1.jpg";

const ProfileDropdown = ({}) => {
  const { data: session } = useSession();

  return (
    <React.Fragment>
      <UncontrolledDropdown
        nav
        inNavbar
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <Image
              className="rounded-circle header-profile-user"
              src={avatar1}
              alt="Header Avatar"
              width={40}
              height={40}
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {session?.user.name}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                {session?.user?.role && session?.user?.role.length > 0
                  ? session?.user?.role[0]
                  : "User"}
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Welcome {session?.user.name}!</h6>
          <DropdownItem className="p-0">
            <Link href="/profile" className="dropdown-item">
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Profile</span>
            </Link>
          </DropdownItem>
          <div className="dropdown-divider"></div>
          <DropdownItem className="p-0">
            <Link href="/pages-profile-settings" className="dropdown-item">
              <span className="badge bg-success-subtle text-success mt-1 float-end">
                New
              </span>
              <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>{" "}
              <span className="align-middle">Settings</span>
            </Link>
          </DropdownItem>

          <DropdownItem tag="div" className="p-0">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="dropdown-item"
            >
              <i className="mdi mdi-logout text-muted fs-16 align-middle me-1" />{" "}
              <span className="align-middle" data-key="t-logout">
                Logout
              </span>
            </button>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;

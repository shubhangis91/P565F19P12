import React, { useState, useEffect } from "react";

export default function UserListComponent(props) {
  return (
    <div>
      <h1>This is User UserListComponent</h1>
      <p>{props.currDesignation}</p>
      <p>{props.jobSeekerName}</p>
      <p>{props.location}</p>
      <p>{props.workEx}</p>
    </div>
  );
}

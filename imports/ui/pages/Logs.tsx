import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { ModerationLogs } from "/imports/api/moderation/logs/collection";
import type { ModerationLog } from "/imports/types/ModerationLog";

const PAGE_SIZE = 10;

export default function Logs() {
  const [searchText, setSearchText] = useState("");
  const [chatType, setChatType] = useState<string | undefined>();
  const [action, setAction] = useState<string | undefined>();
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const skip = page * PAGE_SIZE;

  // Subscribe to logs
  useTracker(() => {
    Meteor.subscribe("moderationLogs.filtered", {
      limit: PAGE_SIZE,
      skip,
      searchText,
      chatType,
      action,
    });
  }, [searchText, chatType, action, page]);

  // Fetch logs
  const logs = useTracker<ModerationLog[]>(() => {
    return ModerationLogs.find({}, { sort: { createdAt: -1 } }).fetch();
  }, [searchText, chatType, action, page]);

  // Fetch total count
  useEffect(() => {
    Meteor.call(
      "moderationLogs.countFiltered",
      { searchText, chatType, action },
      (err: Meteor.Error, count: number) => {
        if (!err) setTotal(count);
      }
    );
  }, [searchText, chatType, action]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container-xl mt-4">
      <h2>Moderation Logs</h2>

      <div className="row g-3 align-items-center my-3">
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search content or user"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(0);
            }}
          />
        </div>

        <div className="col-auto">
          <select
            className="form-select"
            value={chatType || ""}
            onChange={(e) => {
              setChatType(e.target.value || undefined);
              setPage(0);
            }}
          >
            <option value="">All Chat Types</option>
            <option value="chat">Chat</option>
            <option value="groupchat">Group Chat</option>
            <option value="chatroom">Chatroom</option>
          </select>
        </div>

        <div className="col-auto">
          <select
            className="form-select"
            value={action || ""}
            onChange={(e) => {
              setAction(e.target.value || undefined);
              setPage(0);
            }}
          >
            <option value="">All Actions</option>
            <option value="No Action">No Action</option>
            <option value="Replace With Asterisks (*)">
              Replace With Asterisks (*)
            </option>
            <option value="Block From Sending">Block From Sending</option>
          </select>
        </div>
      </div>

      <table className="table card-table table-hover">
        <thead>
          <tr>
            <th>Time</th>
            <th>From → To</th>
            <th>Type</th>
            <th>Content</th>
            <th>Action</th>
            <th>Keywords</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>
                {log.from} → {log.to}
              </td>
              <td>
                {log.chatType}/{log.messageType}
              </td>
              <td>{log.content}</td>
              <td>
                <span className="badge bg-blue text-blue-fg">{log.action}</span>
              </td>
              <td>{log.matchedKeywords?.join(", ") || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          Page {page + 1} of {totalPages}
        </div>
        <div>
          <button
            className="btn btn-outline-primary me-2"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <button
            className="btn btn-outline-primary"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

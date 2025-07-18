import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import {
  ModerationPolicy,
  ModerationAction,
} from "/imports/types/ModerationPolicy";

const messageTypes = ["txt", "custom"];

type DraftPolicies = Record<string, ModerationPolicy>;

export default function Policies() {
  const [policies, setPolicies] = useState<ModerationPolicy[]>([]);
  const [draftPolicies, setDraftPolicies] = useState<DraftPolicies>({});

  useEffect(() => {
    Meteor.call(
      "moderation.getPolicies",
      (err: Meteor.Error, res: ModerationPolicy[]) => {
        if (!err) {
          setPolicies(res);
          const draft: Record<string, ModerationPolicy> = {};
          res.forEach((p) => {
            draft[p.type] = {
              ...p,
              customField: p.customField || "",};
          });
          setDraftPolicies(draft);
        }
      }
    );
  }, []);

  const handleDraftChange = (type: string, key: string, value: string) => {
    setDraftPolicies((prev) => ({
      ...prev,
      [type]: {
        ...(prev[type] || {}),
        [key]: value,
      },
    }));
  };

  const handleSave = (type: string) => {
    const draft = draftPolicies[type];
    if (!draft) return;
    if (draft.action) {
      Meteor.call("moderation.setPolicy", { type, action: draft.action });
    }
    if (type === "custom" && draft.customField) {
      Meteor.call("moderation.setPolicyCustomField", {
        type,
        customField: draft.customField,
      });
    }
    setPolicies((prev) => {
      const existing = prev.find((p) => p.type === type);
      const updatedPolicy: ModerationPolicy = {
        type,
        action: draft.action,
        customField: draft.customField,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (existing) {
        return prev.map((p) => (p.type === type ? updatedPolicy : p));
      } else {
        return [...prev, updatedPolicy];
      }
    });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Moderation Policy Settings</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h4 className="fw-bold mb-3">Message Type Policies</h4>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th style={{ width: "160px" }}>Message Type</th>
                <th style={{ width: "220px" }}>Action</th>
                <th>Custom Moderation Field</th>
                <th style={{ width: "100px" }}></th>
              </tr>
            </thead>
            <tbody>
              {messageTypes.map((type) => {
                const draft = draftPolicies[type] || {};
                return (
                  <tr key={type}>
                    <td>
                      <strong>{type}</strong>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={draft.action || ""}
                        onChange={(e) =>
                          handleDraftChange(type, "action", e.target.value)
                        }
                      >
                        <option value="">-- No Action --</option>
                        {Object.values(ModerationAction).map((action) => (
                          <option key={action} value={action}>
                            {action}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {type === "custom" && (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Enter your custom field name"
                          value={draft.customField || ""}
                          onChange={(e) =>
                            handleDraftChange(type, "customField", e.target.value)
                          }
                        />
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleSave(type)}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

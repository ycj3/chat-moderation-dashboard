import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
import { Blocklist } from "/imports/api/blocklist/collection";

export default function BlockList() {
  const { blocklist, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe("blocklist");
    const blocklist = Blocklist.find().fetch();
    const isLoading = !handle.ready();

    return { blocklist, isLoading };
  }, []);

  const [word, setWord] = useState("");
  const [category, setCategory] = useState("");

  const handleAdd = () => {
    if (word && category) {
      Meteor.call("blocklist.insert", word, category, (error: Meteor.Error) => {
        if (error) {
          console.error("Error inserting blocklist item:", error);
        } else {
          setWord("");
          setCategory("");
        }
      });
    }
  };
  const handleDelete = (id: string) => {
    Meteor.call("blocklist.remove", id, (error: Meteor.Error) => {
      if (error) {
        console.error("Error removing blocklist item:", error);
      }
    });
  };

  if (isLoading) return <div className="container-xl">Loading...</div>;

  return (
    <div className="page">
      <div className="container-xl mt-4">
        <h2 className="page-title">Blocklist Management</h2>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-2">
              <div className="col">
                <input
                  type="text"
                  placeholder="Blocked Word"
                  className="form-control"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  placeholder="Category (e.g. abusive)"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-primary" onClick={handleAdd}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <table className="table table-vcenter">
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Category</th>
                  <th>Created At</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {blocklist.map((item) => (
                  <tr key={item._id}>
                    <td>{item.word}</td>
                    <td>{item.category}</td>
                    <td>{item.createdAt.toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

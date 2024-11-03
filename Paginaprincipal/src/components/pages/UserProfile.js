import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile = () => {
    return (
        <div className="container rounded bg-white mt-5 mb-5">
            <div className="row">
                <div className="col-md-3 border-right">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                        <img className="rounded-circle mt-5" src="https://via.placeholder.com/150" alt="Profile" />
                    </div>
                </div>
                <div className="col-md-5 border-right">
                    <div className="p-3 py-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="text-right">Profile Settings</h4>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-6">
                                <label className="labels">Name</label>
                                <input type="text" className="form-control" placeholder="Name" />
                            </div>
                            <div className="col-md-6">
                                <label className="labels">Surname</label>
                                <input type="text" className="form-control" placeholder="Surname" />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <label className="labels">Mobile Number</label>
                                <input type="text" className="form-control" placeholder="Mobile Number" />
                            </div>
                            <div className="col-md-12">
                                <label className="labels">Address Line 1</label>
                                <input type="text" className="form-control" placeholder="Address Line 1" />
                            </div>
                            <div className="col-md-12">
                                <label className="labels">Address Line 2</label>
                                <input type="text" className="form-control" placeholder="Address Line 2" />
                            </div>
                            <div className="col-md-12">
                                <label className="labels">State</label>
                                <input type="text" className="form-control" placeholder="State" />
                            </div>
                            <div className="col-md-12">
                                <label className="labels">Country</label>
                                <input type="text" className="form-control" placeholder="Country" />
                            </div>
                        </div>
                        <div className="mt-5 text-center">
                            <button className="btn btn-primary profile-button" type="button">Save Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

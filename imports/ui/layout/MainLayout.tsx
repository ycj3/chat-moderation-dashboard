import React from 'react';
import BlockList from '../pages/BlockList';

// import AuditLogPage from './AuditLogPage';
// import BlockListPage from './BlocklistPage';
// import PoliciesPage from './PoliciesPage';
import Policies from '../pages/Policies';

export default function MainLayout() {

    const [activePage, setActivePage] = React.useState('overview');

    return (
        <div className="page">
            <aside
                className="navbar navbar-vertical navbar-expand-sm position-absolute vh-100"
                data-bs-theme="dark"
            >
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <h1 className="navbar-brand navbar-brand-autodark">
                        Moderation Dashboard
                    </h1>
                    <div className="collapse navbar-collapse" id="sidebar-menu">
                        <ul className="navbar-nav pt-lg-3">
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="#"
                                    onClick={() => setActivePage('overview')}
                                >
                                    <span className="nav-link-title">Overview</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="#"
                                    onClick={() => setActivePage('policies')}
                                >
                                    <span className="nav-link-title">Policies</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="#"
                                    onClick={() => setActivePage('logs')}
                                >
                                    <span className="nav-link-title">Logs</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="#"
                                    onClick={() => setActivePage('blocklist')}
                                >
                                    <span className="nav-link-title">Block List</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <span className="nav-link-title">Link 3</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
            <div className="page-wrapper">
                <div className="page-header d-print-none">
                    {/* <div className="container-xl">
                        <div className="row g-2 align-items-center">
                            <div className="col">
                                <h2 className="page-title">Vertical layout</h2>
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className="page-body">
                    <div className="container-xl">
                        {activePage === 'overview' && (
                            <div className="row row-deck row-cards">
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card">
                                        <div className="card-body" style={{ height: '10rem' }}></div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card">
                                        <div className="card-body" style={{ height: '10rem' }}></div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card">
                                        <div className="card-body" style={{ height: '10rem' }}></div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card">
                                        <div className="card-body" style={{ height: '10rem' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* {activePage === 'logs' && <AuditLogPage />} */}
                        {activePage === 'blocklist' && <BlockList />}
                        {activePage === 'policies' && <Policies />}
                    </div>
                </div>
            </div>
        </div>
    );
}
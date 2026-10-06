
import React from 'react';
import { FiHome, FiSettings, FiGrid, FiActivity } from 'react-icons/fi';
import { Link } from 'react-router';

const FrontDeskSidebar = ({ isOpen }) => {
  const menuItems = [
    {
      label: 'Front Desk',
      path: '/front-desk',
      icon: <FiHome className="size-5 shrink-0" />,
    },
    {
      label: 'Room Type',
      path: '/admin/room-type',
      icon: <FiGrid className="size-5 shrink-0" />,
    },
    {
      label: 'Room Status',
      path: '/admin/room-staus',
      icon: <FiActivity className="size-5 shrink-0" />,
    },
  ];

  return (
    <div
      className={`drawer-side transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-14'
      }`}
      style={{ overflow: 'visible' }}
    >
      <label
        htmlFor="my-drawer-4"
        aria-label="close sidebar"
        className="drawer-overlay"
      />

      <div
        className={`flex min-h-full flex-col items-start bg-base-200 ${
          isOpen ? 'w-64' : 'w-14'
        } transition-all duration-300 ease-in-out`}
      >
        <ul className="menu w-full grow">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`${
                  !isOpen ? 'tooltip tooltip-right' : ''
                } flex items-center gap-3 px-3`}
                data-tip={!isOpen ? item.label : undefined}
              >
                {item.icon}

                <span className={isOpen ? 'inline' : 'hidden'}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FrontDeskSidebar;

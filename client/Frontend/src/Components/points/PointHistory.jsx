import React from 'react';
import { FaBitcoin, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import moment from 'moment';

const PointHistory = ({ history }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaBitcoin className="text-yellow-500 mr-2" />
        Points History
      </h3>
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="text-lg font-medium text-gray-800">{item.action}</p>
              <p className="text-sm text-gray-500">{moment(item.date).format('MMMM Do YYYY, h:mm a')}</p>
            </div>
            <div className={`flex items-center ${item.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {item.points > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              <span className="text-lg font-semibold">{Math.abs(item.points)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PointHistory;

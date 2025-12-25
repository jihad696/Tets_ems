import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import dayjs from 'dayjs';

export default function EmployeeReport() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employees/');
      setEmployees(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employee report.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading employee report...</div>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="page">
      <h1>Employee Report</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Email Address</th>
            <th>Mobile Number</th>
            <th>Position</th>
            <th>Hired On</th>
            <th>Days Employed</th>
            <th>Company Name</th>
            <th>Department Name</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{`${emp.first_name} ${emp.last_name}`}</td>
              <td>{emp.email}</td>
              <td>{emp.mobile_number}</td>
              <td>{emp.designation}</td>
              <td>{dayjs(emp.hired_date).format('YYYY-MM-DD')}</td>
              <td>{dayjs().diff(dayjs(emp.hired_date), 'day')}</td>
              <td>{emp.company_name}</td>
              <td>{emp.department_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

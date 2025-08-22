import React from 'react';
import { Card, Table, Button, Spinner, Badge, ProgressBar, ButtonGroup, Dropdown } from 'react-bootstrap';
import { FaClock, FaDownload, FaFilter } from 'react-icons/fa';

const AttendanceOverviewCard = ({ 
  attendanceData, 
  loading, 
  showAll, 
  setShowAll, 
  onRefresh,
  attendanceFilter,
  onFilterChange,
  onExport
}) => {
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="mb-0">
            <FaClock className="me-2" />
            Attendance Overview
          </Card.Title>
          <div className="d-flex gap-2">
            <Button size="sm" variant="outline-success" onClick={onExport}>
              <FaDownload className="me-1" />
              Export Month
            </Button>
            <Button size="sm" variant="outline-primary" onClick={onRefresh} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <FaFilter className="text-muted" />
          <ButtonGroup size="sm">
            <Button 
              variant={attendanceFilter === 'today' ? 'primary' : 'outline-primary'}
              onClick={() => onFilterChange('today')}
            >
              Today
            </Button>
            <Button 
              variant={attendanceFilter === 'yesterday' ? 'primary' : 'outline-primary'}
              onClick={() => onFilterChange('yesterday')}
            >
              Yesterday
            </Button>
            <Button 
              variant={attendanceFilter === 'all' ? 'primary' : 'outline-primary'}
              onClick={() => onFilterChange('all')}
            >
              All Days
            </Button>
          </ButtonGroup>
        </div>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : attendanceData.length === 0 ? (
          <div className="text-muted text-center py-4">No attendance data available.</div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Today's Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Hours Worked</th>
                </tr>
              </thead>
              <tbody>
                {(showAll ? attendanceData : attendanceData.slice(0, 4)).map((attendance) => (
                  <tr key={attendance._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-success rounded-circle text-white d-flex align-items-center justify-content-center me-2" 
                             style={{ width: 32, height: 32, fontSize: '12px' }}>
                          {attendance.employee?.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div>{attendance.employee?.user?.name || 'Unknown'}</div>
                          <small className="text-muted">{attendance.employee?.designation || ''}</small>
                        </div>
                      </div>
                    </td>
                    <td>{attendance.employee?.department || '—'}</td>
                    <td>
                      <Badge bg={
                        attendance.status === 'Present' ? 'success' : 
                        attendance.status === 'Late' ? 'warning' : 
                        attendance.status === 'Absent' ? 'danger' : 'secondary'
                      }>
                        {attendance.status || 'Unknown'}
                      </Badge>
                    </td>
                    <td>
                      {attendance.checkInTime ? 
                        new Date(attendance.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                        '—'
                      }
                    </td>
                    <td>
                      {attendance.checkOutTime ? 
                        new Date(attendance.checkOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                        '—'
                      }
                    </td>
                    <td>
                      <div style={{ width: '100px' }}>
                        <ProgressBar 
                          now={Math.min((attendance.hoursWorked || 0) / 8 * 100, 100)} 
                          label={`${attendance.hoursWorked || 0}h`}
                          style={{ height: 8 }}
                          variant={
                            (attendance.hoursWorked || 0) >= 8 ? 'success' :
                            (attendance.hoursWorked || 0) >= 6 ? 'info' : 'warning'
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {attendanceData.length > 4 && (
              <div className="text-center mt-3">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? `Show Less (${attendanceData.length - 4} hidden)` : `Show More (${attendanceData.length - 4} more)`}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AttendanceOverviewCard;

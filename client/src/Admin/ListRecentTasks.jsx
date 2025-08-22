import { ListGroup, Badge, ProgressBar } from 'react-bootstrap';

export default function ListRecentTasks({ tasks }) {
  if (!Array.isArray(tasks) || tasks.length === 0) return null;
  return (
    <ListGroup variant="flush">
      {tasks.map((t) => (
        <ListGroup.Item key={t._id} className="px-0">
          <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
            <div className="flex-grow-1">
              <div className="fw-semibold text-truncate" title={t.title}>{t.title}</div>
              <div className="small text-muted text-truncate" title={t.description}>{t.description}</div>
              <div className="small text-muted">Assigned to: {t.assignedTo?.user?.name || '—'}</div>
            </div>
            <Badge bg={t.status === 'Completed' ? 'success' : t.status === 'In Progress' ? 'info' : 'secondary'}>{t.status}</Badge>
          </div>
          <div className="mt-2">
            <ProgressBar now={t.progress || 0} label={`${t.progress ?? 0}%`} style={{ height: 10 }} />
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}



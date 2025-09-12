import React from 'react';
import ActivityCard from './ActivityCard';
import './ActivityBucket.css';

const ActivityBucket = ({ bucket, onDrop, onDragOver, onRemove, isDragging, onTimeChange, isBucketOpen }) => {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={`activity-bucket ${isDragging ? 'dragging' : ''} ${isBucketOpen ? 'open' : ''}`}
    >
      <h3 className="bucket-title">Drop here</h3>
      {bucket.length === 0 ? (
        <p className="empty-bucket-message">Drag and drop activities here</p>
      ) : (
        <div className="bucket-grid">
          {bucket.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onRemove={onRemove}
              isDraggable={false}
              showTime={true}
              onTimeChange={(activityId, _, newTime) => onTimeChange(activityId, newTime)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityBucket;

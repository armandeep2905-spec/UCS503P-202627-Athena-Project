import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function AddReminderModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    setLoading(true);
    await onAdd({ title, date, note });
    setLoading(false);
    setTitle('');
    setDate('');
    setNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Academic Reminder">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. UCS301 Lab Evaluation"
        />
        <Input
          label="Due Date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div>
          <label className="block text-xs font-medium text-secondary mb-1.5">Details (Optional)</label>
          <textarea
            className="w-full px-3 py-2 rounded-theme-md border border-border bg-surface-raised text-on-surface placeholder:text-muted text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-xs"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Room number, reference syllabus chapter, submission portal..."
          />
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-border mt-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" loading={loading} disabled={!title.trim() || !date}>
            Save Reminder
          </Button>
        </div>
      </form>
    </Modal>
  );
}

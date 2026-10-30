import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useEventContext } from '@/context/EventContext';

export function DeleteEventModal() {
  const { deletingEvent, setDeletingEvent, deleteEvent } = useEventContext();

  if (!deletingEvent) return null;

  const handleDelete = () => {
    deleteEvent(deletingEvent.id);
    setDeletingEvent(null);
  };

  return (
    <Modal
      isOpen={!!deletingEvent}
      onClose={() => setDeletingEvent(null)}
      size="sm"
      className="p-6"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div>
          <h3 className="font-heading font-bold text-lg text-charcoal">
            Delete Celebration?
          </h3>
          <p className="text-xs text-charcoal-light mt-1.5 leading-relaxed">
            Are you sure you want to remove <span className="font-semibold text-charcoal font-sans">"{deletingEvent.name}"</span>? This will permanently erase associated guest rosters, budget ledgers, and schedule records.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setDeletingEvent(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1 shadow-xs"
            onClick={handleDelete}
          >
            Delete Celebration
          </Button>
        </div>
      </div>
    </Modal>
  );
}


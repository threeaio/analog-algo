import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { shapes } from '@/config/shapes';
import * as React from 'react';

interface ShapeSelectorProps {
  selectedShape: string;
  onShapeSelect: (value: string) => void;
  onAddShape: () => void;
}

const ShapeSelector: React.FC<ShapeSelectorProps> = (props) => {
  const { selectedShape, onShapeSelect, onAddShape } = props;
  return (
    <div className="flex items-center gap-2">
      <Select value={selectedShape} onValueChange={onShapeSelect}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select a shape" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(shapes).map(([key, shape]) => (
            <SelectItem key={key} value={key}>
              {shape.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="ghost" onClick={onAddShape} disabled={!selectedShape}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default ShapeSelector;

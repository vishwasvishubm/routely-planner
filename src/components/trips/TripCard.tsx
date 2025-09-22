import { Calendar, MapPin, DollarSign, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Trip, TripStats } from '@/types/database';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TripCardProps {
  trip: Trip;
  stats?: TripStats;
  onEdit?: (trip: Trip) => void;
  onDelete?: (tripId: string) => void;
}

export function TripCard({ trip, stats, onEdit, onDelete }: TripCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge className="status-active">Active</Badge>;
      case 'upcoming':
        return <Badge className="status-upcoming">Upcoming</Badge>;
      case 'completed':
        return <Badge className="status-completed">Completed</Badge>;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    if (!stats) return null;
    
    if (stats.daysUntilStart && stats.daysUntilStart > 0) {
      return `${stats.daysUntilStart} days until departure`;
    }
    if (stats.daysRemaining && stats.daysRemaining > 0) {
      return `${stats.daysRemaining} days remaining`;
    }
    if (stats.status === 'completed') {
      return 'Trip completed';
    }
    return null;
  };

  return (
    <Card className="card-travel group hover:scale-[1.02] cursor-pointer">
      <Link to={`/trips/${trip.id}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-smooth">
                {trip.title}
              </h3>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                {trip.destination}
              </div>
            </div>
            {stats && getStatusBadge(stats.status)}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Date Range */}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>

          {/* Status Message */}
          {getStatusMessage() && (
            <p className="text-sm font-medium text-primary">
              {getStatusMessage()}
            </p>
          )}

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
              <div className="text-center">
                <div className="flex items-center justify-center text-primary mb-1">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="text-xs text-muted-foreground">Expenses</div>
                <div className="text-sm font-semibold">${stats.totalExpenses.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-accent mb-1">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-xs text-muted-foreground">Activities</div>
                <div className="text-sm font-semibold">{stats.totalItineraryItems}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-success mb-1">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="text-xs text-muted-foreground">Memories</div>
                <div className="text-sm font-semibold">{stats.totalMemories}</div>
              </div>
            </div>
          )}

          {/* Notes Preview */}
          {trip.notes && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {trip.notes}
            </p>
          )}
        </CardContent>
      </Link>

      {/* Action Buttons */}
      {(onEdit || onDelete) && (
        <div className="px-6 pb-4">
          <div className="flex space-x-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(trip);
                }}
                className="flex-1"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(trip.id);
                }}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
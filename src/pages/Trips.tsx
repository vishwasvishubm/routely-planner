import { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TripCard } from '@/components/trips/TripCard';
import { useTripStore } from '@/stores/tripStore';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Trips() {
  const { trips, tripStats, isLoading, loadTrips, deleteTrip } = useTripStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (statusFilter === 'all') return true;
    
    const stats = tripStats[trip.id];
    return stats?.status === statusFilter;
  });

  const handleDeleteTrip = async (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip? This will also delete all related itinerary items, expenses, and memories.')) {
      await deleteTrip(tripId);
    }
  };

  if (isLoading && trips.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-hero rounded-full animate-pulse mx-auto"></div>
          <p className="text-muted-foreground">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your travel adventures
          </p>
        </div>
        <Link to="/trips/new">
          <Button className="btn-hero">
            <Plus className="w-5 h-5 mr-2" />
            New Trip
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search trips by title or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trips</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trip Statistics */}
      {trips.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{trips.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {Object.values(tripStats).filter(stats => stats?.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-warning">
              {Object.values(tripStats).filter(stats => stats?.status === 'upcoming').length}
            </div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {Object.values(tripStats).filter(stats => stats?.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </div>
      )}

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              stats={tripStats[trip.id]}
              onDelete={handleDeleteTrip}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          {trips.length === 0 ? (
            <>
              <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No trips yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start planning your next adventure by creating your first trip.
              </p>
              <Link to="/trips/new">
                <Button size="lg" className="btn-hero">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Trip
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No trips found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
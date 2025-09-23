import { useEffect, useState } from 'react';
import { Plus, MapPin, TrendingUp, Calendar, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TripCard } from '@/components/trips/TripCard';
import { useTripStore } from '@/stores/tripStore';
import { initializeDemoData } from '@/services/database';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { trips, tripStats, isLoading, loadTrips } = useTripStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (!isInitialized) {
        await initializeDemoData();
        await loadTrips();
        setIsInitialized(true);
      }
    };
    
    initializeApp();
  }, [loadTrips, isInitialized]);

  const activeTrips = trips.filter(trip => {
    const stats = tripStats[trip.id];
    return stats?.status === 'active';
  });

  const upcomingTrips = trips.filter(trip => {
    const stats = tripStats[trip.id];
    return stats?.status === 'upcoming';
  });

  const recentTrips = trips.slice(0, 3);

  const totalExpenses = Object.values(tripStats).reduce(
    (sum, stats) => sum + (stats?.totalExpenses || 0), 
    0
  );

  const totalMemories = Object.values(tripStats).reduce(
    (sum, stats) => sum + (stats?.totalMemories || 0), 
    0
  );

  if (isLoading && !isInitialized) {
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
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Discover God's Own Country
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6 max-w-2xl">
            Your ultimate companion for exploring Kerala's backwaters, hill stations, 
            and pristine beaches. Plan your Kerala journey, track expenses, and capture memories.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/trips/new">
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm">
                <Plus className="w-5 h-5 mr-2" />
                Plan New Trip
              </Button>
            </Link>
            {trips.length > 0 && (
              <Link to="/trips">
                <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm">
                  View All Trips
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-travel">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{trips.length}</p>
                <p className="text-sm text-muted-foreground">Total Trips</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-travel">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalExpenses.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-travel">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeTrips.length}</p>
                <p className="text-sm text-muted-foreground">Active Trips</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-travel">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMemories}</p>
                <p className="text-sm text-muted-foreground">Memories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Trips */}
      {activeTrips.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Active Trips</h2>
            <Link to="/trips">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                stats={tripStats[trip.id]}
              />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Trips */}
      {upcomingTrips.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Upcoming Trips</h2>
            <Link to="/trips">
              <Button variant="outline">View More</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTrips.slice(0, 3).map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                stats={tripStats[trip.id]}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Trips */}
      {trips.length > 0 && (activeTrips.length === 0 && upcomingTrips.length === 0 || trips.length > (activeTrips.length + upcomingTrips.length)) && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Trips</h2>
            <Link to="/trips">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                stats={tripStats[trip.id]}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {trips.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Start Your Kerala Adventure</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Create your first Kerala trip to explore backwaters, hill stations, beaches,
            and cultural experiences across God's Own Country.
          </p>
          <Link to="/trips/new">
            <Button size="lg" className="btn-hero">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Trip
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
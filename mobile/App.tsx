import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';

type Plan = {
  id: string;
  title: string;
  focus: string;
  completion: number;
};

type Session = {
  id: string;
  opponent: string;
  drill: string;
  duration: string;
};

const plans: Plan[] = [
  { id: 'p1', title: 'Southpaw Pressure', focus: 'Angles + exits', completion: 78 },
  { id: 'p2', title: 'Counter Ladder', focus: 'Slip to cross', completion: 54 },
  { id: 'p3', title: 'Body Attack Flow', focus: 'Feints to liver', completion: 33 },
];

const sessions: Session[] = [
  { id: 's1', opponent: 'Luis M.', drill: 'Ring cut sequencing', duration: '34 min' },
  { id: 's2', opponent: 'Spar Group B', drill: 'Defensive shell reset', duration: '52 min' },
  { id: 's3', opponent: 'Coach rounds', drill: 'High-low combinations', duration: '27 min' },
];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.app}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Welcome back</Text>
            <Text style={styles.title}>StratWeave</Text>
          </View>
          <Pressable style={styles.profilePill}>
            <Text style={styles.profileInitials}>NW</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.statsRow}>
            <InfoCard label="Sessions" value="24" helper="+4 this week" />
            <InfoCard label="Readiness" value="86%" helper="Conditioning solid" />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <ActionButton title="Start Drill" />
              <ActionButton title="Open Bag" />
              <ActionButton title="New Blueprint" />
              <ActionButton title="Review Clips" />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Plans</Text>
              <Text style={styles.sectionLink}>See all</Text>
            </View>
            {plans.map((plan) => (
              <View key={plan.id} style={styles.planCard}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planFocus}>{plan.focus}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${plan.completion}%` }]} />
                </View>
                <Text style={styles.planProgress}>{plan.completion}% complete</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Sessions</Text>
              <Text style={styles.sectionLink}>History</Text>
            </View>
            {sessions.map((session) => (
              <View key={session.id} style={styles.sessionRow}>
                <View style={styles.sessionDot} />
                <View style={styles.sessionDetails}>
                  <Text style={styles.sessionOpponent}>{session.opponent}</Text>
                  <Text style={styles.sessionDrill}>{session.drill}</Text>
                </View>
                <Text style={styles.sessionDuration}>{session.duration}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomTab}>
          <TabItem label="Home" active />
          <TabItem label="Plans" />
          <TabItem label="Analyze" />
          <TabItem label="Profile" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function InfoCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
      <Text style={styles.infoHelper}>{helper}</Text>
    </View>
  );
}

function ActionButton({ title }: { title: string }) {
  return (
    <Pressable style={styles.actionButton}>
      <Text style={styles.actionText}>{title}</Text>
    </Pressable>
  );
}

function TabItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <Pressable style={[styles.tabItem, active && styles.tabItemActive]}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020817',
  },
  app: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyebrow: {
    color: '#94A3B8',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    color: '#F1F5F9',
    fontSize: 30,
    fontWeight: '700',
  },
  profilePill: {
    backgroundColor: '#1E293B',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    color: '#E2E8F0',
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 6,
  },
  infoValue: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoHelper: {
    color: '#38BDF8',
    fontSize: 12,
  },
  section: {
    marginTop: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#E2E8F0',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionLink: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    width: '48.5%',
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  actionText: {
    color: '#EFF6FF',
    fontWeight: '600',
    fontSize: 14,
  },
  planCard: {
    backgroundColor: '#0B1120',
    borderColor: '#1E293B',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  planTitle: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 15,
  },
  planFocus: {
    color: '#94A3B8',
    marginTop: 3,
    marginBottom: 10,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E293B',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22D3EE',
    borderRadius: 4,
  },
  planProgress: {
    marginTop: 8,
    color: '#CBD5E1',
    fontSize: 12,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1120',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 8,
  },
  sessionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22D3EE',
    marginRight: 12,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionOpponent: {
    color: '#F8FAFC',
    fontWeight: '600',
  },
  sessionDrill: {
    color: '#94A3B8',
    marginTop: 1,
    fontSize: 12,
  },
  sessionDuration: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  bottomTab: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
    borderWidth: 1,
    borderRadius: 16,
    padding: 6,
    gap: 6,
  },
  tabItem: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: '#1E3A8A',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#DBEAFE',
  },
});

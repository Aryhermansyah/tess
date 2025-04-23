import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Card } from '@/components/shared/Card';
import { AnimatedView } from '@/components/shared/AnimatedView';
import { Divider } from '@/components/shared/Divider';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingScheduleStore } from '@/store/wedding-store';
import { Clock, MapPin, Info, Shirt, ChevronDown, ChevronUp, Users, Calendar } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

export const Schedule: React.FC = () => {
  // Use the schedule store directly instead of the compatibility layer
  const schedule = useWeddingScheduleStore((state) => state.schedule);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const toggleEventExpand = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  // Add null check to prevent errors when data is undefined
  if (!schedule || schedule.length === 0) {
    return (
      <View style={styles.container}>
        <AnimatedView animation="fadeIn" style={styles.headerContainer}>
          <View style={styles.titleWrapper}>
            <Calendar size={isSmallScreen ? 18 : 24} color={colors.text} />
            <Text style={styles.sectionTitle}>Jadwal Acara</Text>
          </View>
          <Divider style={styles.divider} />
        </AnimatedView>
        <Text style={styles.loadingText}>Jadwal acara belum tersedia</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedView animation="fadeIn" style={styles.headerContainer}>
        <View style={styles.titleWrapper}>
          <Calendar size={isSmallScreen ? 18 : 24} color={colors.text} />
          <Text style={styles.sectionTitle}>Jadwal Acara</Text>
        </View>
        <Divider style={styles.divider} />
      </AnimatedView>

      <View style={styles.timelineContainer}>
        {schedule.map((event, index) => (
          <AnimatedView 
            key={event.id} 
            animation="slideLeft" 
            delay={300 * index}
            style={styles.timelineItem}
          >
            <View style={styles.timelineLine}>
              <View style={styles.timelineDot} />
              {index < schedule.length - 1 && <View style={styles.timelineConnector} />}
            </View>
            
            <View style={styles.eventContainer}>
              <Card style={styles.eventCard} variant="elevated">
                <TouchableOpacity 
                  style={styles.eventHeader}
                  onPress={() => toggleEventExpand(event.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  
                  <View style={styles.eventDetails}>
                    <View style={styles.detailRow}>
                      <Clock size={16} color={colors.primary} />
                      <Text style={styles.detailText}>{event.time}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <MapPin size={16} color={colors.primary} />
                      <Text style={styles.detailText}>{event.venue || event.location}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Info size={16} color={colors.primary} />
                      <Text style={styles.detailText}>{event.description}</Text>
                    </View>
                    
                    {event.dress && (
                      <View style={styles.detailRow}>
                        <Shirt size={16} color={colors.primary} />
                        <Text style={styles.detailText}>Dress Code: {event.dress}</Text>
                      </View>
                    )}
                  </View>
                  
                  {event.detailedRundown && event.detailedRundown.length > 0 && (
                    <View style={styles.expandButtonContainer}>
                      <Text style={styles.expandButtonText}>
                        {expandedEvent === event.id ? 'Sembunyikan Rundown Detail' : 'Tampilkan Rundown Detail'}
                      </Text>
                      {expandedEvent === event.id ? 
                        <ChevronUp size={16} color={colors.primary} /> : 
                        <ChevronDown size={16} color={colors.primary} />
                      }
                    </View>
                  )}
                </TouchableOpacity>
                
                {expandedEvent === event.id && event.detailedRundown && event.detailedRundown.length > 0 && (
                  <View style={styles.rundownContainer}>
                    <Divider style={styles.rundownDivider} />
                    <Text style={styles.rundownTitle}>Rundown Detail</Text>
                    
                    {event.detailedRundown.map((item, idx) => (
                      <View key={item.id} style={styles.rundownItem}>
                        <View style={styles.rundownTimeContainer}>
                          <Text style={styles.rundownTime}>{item.time}</Text>
                        </View>
                        
                        <View style={styles.rundownContent}>
                          <Text style={styles.rundownActivity}>{item.activity}</Text>
                          
                          <View style={styles.personnelContainer}>
                            <Users size={14} color={colors.textLight} />
                            <Text style={styles.rundownPersonnel}>{item.personnel}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            </View>
          </AnimatedView>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: isSmallScreen ? 16 : 20,
    backgroundColor: colors.primaryLight,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? 16 : 24,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    paddingVertical: isSmallScreen ? 8 : 12,
    paddingHorizontal: isSmallScreen ? 16 : 24,
    borderRadius: 30,
    marginBottom: 8,
  },
  sectionTitle: {
    ...fonts.heading,
    fontSize: isSmallScreen ? fonts.sizes.xl : fonts.sizes.xxl,
    color: colors.text,
  },
  divider: {
    width: isSmallScreen ? 80 : 100,
    height: 2,
    backgroundColor: colors.primary,
  },
  loadingText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    textAlign: 'center',
    padding: 20,
  },
  timelineContainer: {
    paddingLeft: isSmallScreen ? 16 : 40,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLine: {
    width: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
  },
  timelineConnector: {
    width: 2,
    height: '100%',
    backgroundColor: colors.primary,
    marginTop: 4,
    marginLeft: 11,
    position: 'absolute',
    top: 24,
  },
  eventContainer: {
    flex: 1,
  },
  eventCard: {
    marginBottom: 8,
    overflow: 'hidden',
  },
  eventHeader: {
    padding: 16,
  },
  eventTitle: {
    ...fonts.heading,
    fontSize: fonts.sizes.lg,
    color: colors.text,
    marginBottom: 12,
  },
  eventDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.text,
    flex: 1,
  },
  expandButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    gap: 4,
  },
  expandButtonText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  rundownContainer: {
    padding: 16,
    backgroundColor: colors.primaryLight + '50',
  },
  rundownDivider: {
    marginBottom: 16,
  },
  rundownTitle: {
    ...fonts.subheading,
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: 12,
  },
  rundownItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
  },
  rundownTimeContainer: {
    backgroundColor: colors.primary + '30',
    padding: 12,
    justifyContent: 'center',
    minWidth: isSmallScreen ? 80 : 100,
  },
  rundownTime: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  rundownContent: {
    flex: 1,
    padding: 12,
  },
  rundownActivity: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.text,
    marginBottom: 8,
  },
  personnelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rundownPersonnel: {
    ...fonts.body,
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    fontStyle: 'italic',
    flex: 1,
  },
});
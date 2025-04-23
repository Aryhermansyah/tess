import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Divider } from '@/components/shared/Divider';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingScheduleStore } from '@/store/wedding-store';
import { Event, RundownItem } from '@/types';
import { Plus, Trash2, Edit, ChevronDown, ChevronUp, Clock, Calendar } from 'lucide-react-native';
import { injectAnimationStyles } from '@/styles/animations';

export const ScheduleForm: React.FC = () => {
  // Inject CSS animations untuk web platform
  useEffect(() => {
    injectAnimationStyles();
  }, []);

  const schedule = useWeddingScheduleStore((state) => state.schedule);
  const updateSchedule = useWeddingScheduleStore((state) => state.updateSchedule);
  
  const [events, setEvents] = useState<Event[]>(schedule);
  const [currentEvent, setCurrentEvent] = useState<Event>({
    id: '',
    title: '',
    time: '',
    venue: '',
    description: '',
    dress: '',
    detailedRundown: [],
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  
  // For rundown management
  const [showRundownForm, setShowRundownForm] = useState(false);
  const [currentRundownItem, setCurrentRundownItem] = useState<RundownItem>({
    id: '',
    time: '',
    activity: '',
    personnel: '',
  });
  const [editingRundownItem, setEditingRundownItem] = useState<string | null>(null);

  const handleChange = (field: keyof Event, value: string) => {
    setCurrentEvent({
      ...currentEvent,
      [field]: value,
    });
  };

  const handleRundownItemChange = (field: keyof RundownItem, value: string) => {
    setCurrentRundownItem({
      ...currentRundownItem,
      [field]: value,
    });
  };

  const handleAddEvent = () => {
    if (!currentEvent.title || !currentEvent.time) {
      Alert.alert('Error', 'Silakan masukkan setidaknya judul dan waktu acara');
      return;
    }

    if (editing) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === editing ? { ...currentEvent, id: editing } : event
      );
      setEvents(updatedEvents);
      setEditing(null);
    } else {
      // Add new event
      const newEvent = {
        ...currentEvent,
        id: Date.now().toString(),
      };
      setEvents([...events, newEvent]);
    }

    // Reset form
    setCurrentEvent({
      id: '',
      title: '',
      time: '',
      venue: '',
      description: '',
      dress: '',
      detailedRundown: [],
    });
    setShowRundownForm(false);
  };

  const handleEditEvent = (event: Event) => {
    setCurrentEvent({
      ...event,
      detailedRundown: event.detailedRundown || [],
    });
    setEditing(event.id);
    setExpandedEvent(event.id);
  };

  const handleDeleteEvent = (id: string) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menghapus acara ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => {
            setEvents(events.filter(event => event.id !== id));
            if (editing === id) {
              setEditing(null);
              setCurrentEvent({
                id: '',
                title: '',
                time: '',
                venue: '',
                description: '',
                dress: '',
                detailedRundown: [],
              });
            }
            if (expandedEvent === id) {
              setExpandedEvent(null);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const toggleEventExpand = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  // Rundown management
  const handleAddRundownItem = () => {
    if (!currentRundownItem.time || !currentRundownItem.activity) {
      Alert.alert('Error', 'Silakan masukkan setidaknya waktu dan aktivitas');
      return;
    }

    const currentRundown = currentEvent.detailedRundown || [];

    if (editingRundownItem) {
      // Update existing rundown item
      const updatedRundown = currentRundown.map(item => 
        item.id === editingRundownItem ? { ...currentRundownItem, id: editingRundownItem } : item
      );
      setCurrentEvent({
        ...currentEvent,
        detailedRundown: updatedRundown,
      });
      setEditingRundownItem(null);
    } else {
      // Add new rundown item
      const newItem = {
        ...currentRundownItem,
        id: `${currentEvent.id || 'new'}-${Date.now()}`,
      };
      
      // Pastikan array detailedRundown sudah diinisialisasi
      const updatedDetailedRundown = Array.isArray(currentRundown) ? [...currentRundown, newItem] : [newItem];
      
      setCurrentEvent({
        ...currentEvent,
        detailedRundown: updatedDetailedRundown,
      });
      
      // Log untuk debugging
      console.log('Item rundown ditambahkan:', newItem);
      console.log('Current event setelah penambahan:', {...currentEvent, detailedRundown: updatedDetailedRundown});
    }

    // Reset rundown form
    setCurrentRundownItem({
      id: '',
      time: '',
      activity: '',
      personnel: '',
    });
  };

  const handleEditRundownItem = (item: RundownItem) => {
    setCurrentRundownItem(item);
    setEditingRundownItem(item.id);
  };

  const handleDeleteRundownItem = (id: string) => {
    const updatedRundown = (currentEvent.detailedRundown || []).filter(item => item.id !== id);
    setCurrentEvent({
      ...currentEvent,
      detailedRundown: updatedRundown,
    });
    if (editingRundownItem === id) {
      setEditingRundownItem(null);
      setCurrentRundownItem({
        id: '',
        time: '',
        activity: '',
        personnel: '',
      });
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        updateSchedule(events);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        console.error('Error updating schedule:', error);
        Alert.alert(
          'Gagal Menyimpan',
          'Terjadi kesalahan saat menyimpan data. Coba hapus beberapa data yang tidak diperlukan.',
          [{ text: 'OK' }]
        );
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Jadwal Acara</Text>
        <Text style={styles.subtitle}>Kelola jadwal dan rundown acara pernikahan</Text>

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Jadwal berhasil diperbarui!</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {editing ? 'Edit Acara' : 'Tambah Acara Baru'}
        </Text>
        
        <Input
          label="Judul Acara"
          value={currentEvent.title}
          onChangeText={(value) => handleChange('title', value)}
          placeholder="Contoh: Akad Nikah"
          leftIcon={<Calendar size={20} color={colors.textLight} />}
        />
        <Input
          label="Waktu"
          value={currentEvent.time}
          onChangeText={(value) => handleChange('time', value)}
          placeholder="Contoh: 08:00 - 10:00 WIB"
          leftIcon={<Clock size={20} color={colors.textLight} />}
        />
        <Input
          label="Tempat"
          value={currentEvent.venue}
          onChangeText={(value) => handleChange('venue', value)}
          placeholder="Lokasi acara"
        />
        <Input
          label="Deskripsi"
          value={currentEvent.description}
          onChangeText={(value) => handleChange('description', value)}
          placeholder="Deskripsi singkat acara"
          multiline
          numberOfLines={3}
        />
        <Input
          label="Dress Code"
          value={currentEvent.dress}
          onChangeText={(value) => handleChange('dress', value)}
          placeholder="Contoh: Putih & Gold"
        />

        {/* Rundown Section */}
        <View style={styles.rundownSection}>
          <View style={styles.rundownHeader}>
            <Text style={styles.rundownTitle}>Rundown Detail</Text>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setShowRundownForm(!showRundownForm)}
            >
              <Text style={styles.toggleButtonText}>
                {showRundownForm ? 'Sembunyikan Form Rundown' : 'Tampilkan Form Rundown'}
              </Text>
              {showRundownForm ? 
                <ChevronUp size={16} color={colors.primary} /> : 
                <ChevronDown size={16} color={colors.primary} />
              }
            </TouchableOpacity>
          </View>

          {showRundownForm && (
            <View style={styles.rundownForm}>
              <Input
                label="Waktu"
                value={currentRundownItem.time}
                onChangeText={(value) => handleRundownItemChange('time', value)}
                placeholder="Contoh: 08:00 - 09:00"
              />
              <Input
                label="Aktivitas"
                value={currentRundownItem.activity}
                onChangeText={(value) => handleRundownItemChange('activity', value)}
                placeholder="Nama aktivitas"
              />
              <Input
                label="Personil"
                value={currentRundownItem.personnel}
                onChangeText={(value) => handleRundownItemChange('personnel', value)}
                placeholder="Penanggung jawab / peserta"
              />
              
              <Button
                title={editingRundownItem ? "Perbarui Item Rundown" : "Tambah Item Rundown"}
                onPress={handleAddRundownItem}
                icon={<Plus size={18} color={colors.white} />}
                style={styles.addRundownButton}
              />
              
              {editingRundownItem && (
                <Button
                  title="Batal Edit Rundown"
                  onPress={() => {
                    setEditingRundownItem(null);
                    setCurrentRundownItem({
                      id: '',
                      time: '',
                      activity: '',
                      personnel: '',
                    });
                  }}
                  variant="outline"
                  style={styles.cancelRundownButton}
                />
              )}
              
              {currentEvent.detailedRundown && currentEvent.detailedRundown.length > 0 && (
                <View style={styles.currentRundownList}>
                  <Text style={styles.currentRundownTitle}>Rundown Saat Ini:</Text>
                  
                  {currentEvent.detailedRundown.map((item) => (
                    <View key={item.id} style={styles.rundownItem}>
                      <View style={styles.rundownItemInfo}>
                        <Text style={styles.rundownItemTime}>{item.time}</Text>
                        <Text style={styles.rundownItemActivity}>{item.activity}</Text>
                        <Text style={styles.rundownItemPersonnel}>{item.personnel}</Text>
                      </View>
                      <View style={styles.rundownItemActions}>
                        <TouchableOpacity 
                          style={styles.rundownActionButton}
                          onPress={() => handleEditRundownItem(item)}
                        >
                          <Edit size={16} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.rundownActionButton}
                          onPress={() => handleDeleteRundownItem(item.id)}
                        >
                          <Trash2 size={16} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        <Button
          title={editing ? 'Perbarui Acara' : 'Tambah Acara'}
          onPress={handleAddEvent}
          icon={<Plus size={18} color={colors.white} />}
          style={styles.addButton}
        />

        {editing && (
          <Button
            title="Batal Edit"
            onPress={() => {
              setEditing(null);
              setCurrentEvent({
                id: '',
                title: '',
                time: '',
                venue: '',
                description: '',
                dress: '',
                detailedRundown: [],
              });
              setShowRundownForm(false);
            }}
            variant="outline"
            style={styles.cancelButton}
          />
        )}

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Daftar Acara ({events.length})</Text>
        
        {events.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada acara yang ditambahkan</Text>
        ) : (
          events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <TouchableOpacity 
                style={styles.eventHeader}
                onPress={() => toggleEventExpand(event.id)}
              >
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                  <Text style={styles.eventVenue}>{event.venue}</Text>
                </View>
                <View style={styles.eventActions}>
                  {event.detailedRundown && event.detailedRundown.length > 0 && (
                    <View style={styles.rundownIndicator}>
                      <Clock size={16} color={colors.primary} />
                      <Text style={styles.rundownCount}>{event.detailedRundown.length}</Text>
                    </View>
                  )}
                  {expandedEvent === event.id ? 
                    <ChevronUp size={18} color={colors.primary} /> : 
                    <ChevronDown size={18} color={colors.primary} />
                  }
                </View>
              </TouchableOpacity>
              
              {expandedEvent === event.id && (
                <View style={styles.expandedContent}>
                  <Divider style={styles.expandedDivider} />
                  
                  <View style={styles.eventDetails}>
                    {event.description && (
                      <Text style={styles.eventDescription}>{event.description}</Text>
                    )}
                    {event.dress && (
                      <Text style={styles.eventDress}>Dress Code: {event.dress}</Text>
                    )}
                  </View>
                  
                  {event.detailedRundown && event.detailedRundown.length > 0 && (
                    <View style={styles.expandedRundown}>
                      <Text style={styles.expandedRundownTitle}>Rundown Detail:</Text>
                      {event.detailedRundown.map((item, index) => (
                        <View key={item.id} style={styles.expandedRundownItem}>
                          <Text style={styles.expandedRundownNumber}>{index + 1}.</Text>
                          <View style={styles.expandedRundownInfo}>
                            <Text style={styles.expandedRundownTime}>{item.time}</Text>
                            <Text style={styles.expandedRundownActivity}>{item.activity}</Text>
                            <Text style={styles.expandedRundownPersonnel}>{item.personnel}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEditEvent(event)}
                    >
                      <Edit size={18} color={colors.primary} />
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 size={18} color={colors.error} />
                      <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}

        <Button
          title="Simpan Semua Perubahan"
          onPress={handleSubmit}
          loading={loading}
          style={styles.saveButton}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  title: {
    ...fonts.heading,
    fontSize: fonts.sizes.xxl,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    marginBottom: 24,
  },
  sectionTitle: {
    ...fonts.subheading,
    fontSize: fonts.sizes.lg,
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  divider: {
    marginVertical: 24,
  },
  addButton: {
    marginTop: 16,
  },
  cancelButton: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 24,
  },
  // Event card
  eventCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    fontWeight: 'bold',
    color: colors.text,
  },
  eventTime: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    marginTop: 2,
  },
  eventVenue: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginTop: 2,
  },
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // Expanded event content
  expandedContent: {
    padding: 12,
    backgroundColor: colors.white,
  },
  expandedDivider: {
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventDescription: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.text,
    marginBottom: 8,
  },
  eventDress: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.text,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryLight,
  },
  deleteButton: {
    backgroundColor: colors.error + '20',
  },
  actionButtonText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
  },
  deleteButtonText: {
    color: colors.error,
  },
  emptyText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  // Rundown section
  rundownSection: {
    marginTop: 16,
    backgroundColor: colors.primaryLight + '50',
    borderRadius: 8,
    padding: 12,
  },
  rundownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rundownTitle: {
    ...fonts.subheading,
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleButtonText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
  },
  rundownForm: {
    marginTop: 12,
  },
  addRundownButton: {
    marginTop: 8,
  },
  cancelRundownButton: {
    marginTop: 8,
  },
  currentRundownList: {
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
  },
  currentRundownTitle: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  rundownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rundownItemInfo: {
    flex: 1,
  },
  rundownItemTime: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    fontWeight: 'bold',
    color: colors.text,
  },
  rundownItemActivity: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.text,
  },
  rundownItemPersonnel: {
    ...fonts.body,
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  rundownItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  rundownActionButton: {
    padding: 4,
  },
  // Expanded rundown
  expandedRundown: {
    marginTop: 16,
    backgroundColor: colors.primaryLight + '30',
    borderRadius: 8,
    padding: 12,
  },
  expandedRundownTitle: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  expandedRundownItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  expandedRundownNumber: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    fontWeight: 'bold',
    color: colors.text,
    width: 24,
  },
  expandedRundownInfo: {
    flex: 1,
  },
  expandedRundownTime: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    fontWeight: 'bold',
    color: colors.text,
  },
  expandedRundownActivity: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.text,
  },
  expandedRundownPersonnel: {
    ...fonts.body,
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  rundownIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  rundownCount: {
    ...fonts.body,
    fontSize: fonts.sizes.xs,
    color: colors.primary,
    fontWeight: 'bold',
  },
  successContainer: {
    backgroundColor: colors.success + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.success,
    textAlign: 'center',
  },
});
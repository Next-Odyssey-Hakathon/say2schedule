import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, PanResponder, Platform, StatusBar, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import { useToast } from '../context/ToastContext';
import CustomTabBar from '../components/CustomTabBar';

const { width, height } = Dimensions.get('window');

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Calender = () => {
  const { showToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [marks, setMarks] = useState<{[key: string]: 'green' | 'red' | 'none'}>({});
  const [notes, setNotes] = useState<{[key: string]: string}>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{dateStr: string, day: number} | null>(null);
  const [tempNote, setTempNote] = useState('');

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const isMarkable = (item: {day: number, month: number, year: number}) => {
    const date = new Date(item.year, item.month, item.day);
    date.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    return date.getTime() === today.getTime() || date.getTime() === yesterday.getTime();
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(year, month + offset, 1);
    setCurrentDate(newDate);
  };

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 30,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        changeMonth(-1);
      } else if (gestureState.dx < -50) {
        changeMonth(1);
      }
    },
  }), [month, year]);

  const toggleMark = (dateStr: string, item: any) => {
    if (!isMarkable(item)) {
        showToast('Only Today or Yesterday can be marked', 'info');
        if (notes[dateStr]) {
            showToast(notes[dateStr], 'info');
        }
        return;
    }

    setMarks(prev => {
      const current = prev[dateStr] || 'none';
      let next: 'green' | 'red' | 'none' = 'none';
      if (current === 'none') {
          next = 'green';
          showToast(`Marked ${dateStr} Done`, 'info');
      } else if (current === 'green') {
          next = 'red';
          showToast(`Marked ${dateStr} Missed`, 'error');
      } else {
          next = 'none';
          showToast(`Cleared mark for ${dateStr}`, 'info');
      }
      return { ...prev, [dateStr]: next };
    });

    if (notes[dateStr]) {
        showToast(`Note: ${notes[dateStr]}`, 'info');
    }
  };

  const handleLongPress = (dateStr: string, day: number) => {
      setSelectedDate({dateStr, day});
      setTempNote(notes[dateStr] || '');
      setIsModalVisible(true);
  };

  const saveNote = () => {
      if (selectedDate) {
          setNotes(prev => ({...prev, [selectedDate.dateStr]: tempNote}));
          setIsModalVisible(false);
          showToast('Note saved!', 'success');
      }
  };

  const daysGrid = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    const grid = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthTotalDays - i;
      const m = month === 0 ? 11 : month - 1;
      const y = month === 0 ? year - 1 : year;
      grid.push({ day: d, month: m, year: y, currentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      grid.push({ day: i, month: month, year: year, currentMonth: true });
    }
    
    // Next month days (fill up to 42 cells)
    const remaining = 42 - grid.length;
    for (let i = 1; i <= remaining; i++) {
      const m = month === 11 ? 0 : month + 1;
      const y = month === 11 ? year + 1 : year;
      grid.push({ day: i, month: m, year: y, currentMonth: false });
    }
    
    return grid;
  }, [month, year]);

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
      
      {/* Note Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.modalOverlay}
        >
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Note for {selectedDate?.dateStr}</Text>
                <TextInput
                    style={styles.noteInput}
                    multiline
                    placeholder="Write your message here..."
                    placeholderTextColor="#999"
                    value={tempNote}
                    onChangeText={setTempNote}
                    autoFocus
                />
                <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Logo Header */}
      <View style={styles.header}>
          <Image source={require('../assets/logosaytoschedule.png')} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Date Detail Banner */}
      <View style={styles.dateDetailBanner}>
          <View style={styles.dateNumberContainer}>
              <Text style={styles.dayOfWeekText}>{new Date().toLocaleDateString('en-US', { weekday: 'short' })}.</Text>
              <Text style={styles.dateNumberText}>{new Date().getDate()}</Text>
          </View>
          <View style={styles.dateInfoContainer}>
              <Text style={styles.monthYearText}>{MONTHS[month]} {year}</Text>
              <Text style={styles.trackHabitBanner}>Track your habit</Text>
              <Text style={styles.dayCountText}>Today is working day</Text>
          </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
          <View style={styles.pill}>
              <Text style={styles.pillText}>{MONTHS[month].substring(0, 3)}</Text>
          </View>
          <View style={styles.pill}>
              <Text style={styles.pillText}>{year}</Text>
          </View>
      </View>

      {/* Calendar Grid */}
      <View style={styles.swipeInstructionContainer}>
          <Text style={styles.swipeInstructionText}>Swipe left or right to change months</Text>
      </View>
      <View style={styles.calendarContainer} {...panResponder.panHandlers}>
          <View style={styles.weekHeader}>
              {DAYS_OF_WEEK.map(day => (
                  <Text key={day} style={styles.weekHeaderText}>{day}</Text>
              ))}
          </View>
          <View style={styles.daysGrid}>
              {daysGrid.map((item, index) => {
                  const dateStr = `${item.year}-${item.month + 1}-${item.day}`;
                  const mark = marks[dateStr] || 'none';
                  const note = notes[dateStr];
                  const isToday = item.currentMonth && item.day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                  return (
                      <TouchableOpacity 
                        key={index} 
                        style={[
                            styles.dayCell, 
                            mark === 'green' && styles.greenMark,
                            mark === 'red' && styles.redMark,
                            isToday && mark === 'none' ? styles.todayCell : {}
                        ]}
                        onPress={() => toggleMark(dateStr, item)}
                        onLongPress={() => handleLongPress(dateStr, item.day)}
                        activeOpacity={0.7}
                      >
                          <Text style={[
                              styles.dayText, 
                              !item.currentMonth && styles.otherMonthText,
                              mark !== 'none' && styles.markedDayText,
                              isToday && mark === 'none' && styles.todayText
                          ]}>
                              {item.day}
                          </Text>
                          {note && (
                              <Text 
                                style={[styles.tinyNote, mark !== 'none' && styles.markedNoteText]} 
                                numberOfLines={1}
                              >
                                  {note}
                              </Text>
                          )}
                      </TouchableOpacity>
                  );
              })}
          </View>
      </View>

      {/* Color Legend / Instructions */}
      <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
              <View style={[styles.legendCircle, styles.greenMark]} />
              <Text style={styles.legendText}>Done</Text>
          </View>
          <View style={styles.legendItem}>
              <View style={[styles.legendCircle, styles.redMark]} />
              <Text style={styles.legendText}>Missed</Text>
          </View>
          <View style={styles.legendItem}>
              <View style={[styles.legendCircle, styles.todayCell, {borderWidth: 0}]} />
              <Text style={styles.legendText}>Today</Text>
          </View>
      </View>

      <CustomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 40 : 50,
  },
  header: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 35,
  },
  dateDetailBanner: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dateNumberContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 15,
    minWidth: 65,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  dayOfWeekText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  dateNumberText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  dateInfoContainer: {
    flex: 1,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  dayCountText: {
    fontSize: 12,
    color: '#999',
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 5,
  },
  pill: {
    backgroundColor: '#ffffff',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 10, // Slightly reduced padding for more space
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekHeaderText: {
    width: (width - 30) / 7, // Account for new container padding
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  dayCell: {
    width: (width - 30) / 7, // Matches weekHeaderText width exactly
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 2,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  otherMonthText: {
    color: '#eeeeee',
  },
  todayCell: {
    backgroundColor: '#000000',
  },
  todayText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  markedDayText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  greenMark: {
    backgroundColor: '#34C759', 
  },
  redMark: {
    backgroundColor: '#FF3B30', 
  },
  legendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 15,
      marginBottom: 100, // Adjusted to clear the new standard TabBar
  },
  legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 25, // Increased spacing between items
  },
  legendCircle: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 6,
  },
  legendText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#666',
  },
  tinyNote: {
      fontSize: 8,
      color: '#999',
      marginTop: 2,
      width: '80%',
      textAlign: 'center',
  },
  markedNoteText: {
      color: 'rgba(255, 255, 255, 0.8)',
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  modalContent: {
      width: width * 0.85,
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 20,
      ...Platform.select({
          ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 10 },
          android: { elevation: 15 }
      })
  },
  modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#000',
  },
  noteInput: {
      height: 100,
      borderWidth: 1,
      borderColor: '#eee',
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      textAlignVertical: 'top',
      color: '#333',
  },
  modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 20,
  },
  saveButton: {
      backgroundColor: '#000',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginLeft: 10,
  },
  saveButtonText: {
      color: '#fff',
      fontWeight: 'bold',
  },
  cancelButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  trackHabitBanner: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
    marginTop: 2,
  },
  swipeInstructionContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  swipeInstructionText: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default Calender;
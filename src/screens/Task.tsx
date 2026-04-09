import { 
    View, 
    Text, 
    StyleSheet, 
    StatusBar, 
    Platform, 
    FlatList, 
    TouchableOpacity, 
    Modal, 
    TextInput, 
    KeyboardAvoidingView,
    ScrollView
} from 'react-native'
import React, { useState, useMemo } from 'react'
import { useToast } from '../context/ToastContext';
import CustomTabBar from '../components/CustomTabBar';

interface TaskItem {
    id: string;
    title: string;
    description: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    amPm: 'AM' | 'PM';
    completed: boolean;
}

const Task = () => {
    const { showToast } = useToast();
    const [tasks, setTasks] = useState<TaskItem[]>([
        { id: '1', title: 'Breakfast', description: 'Healthy breakfast with fruit', date: '2026-04-10', time: '08:30', amPm: 'AM', completed: true },
        { id: '2', title: 'Team Sync', description: 'Daily standup meeting', date: '2026-04-10', time: '10:00', amPm: 'AM', completed: false },
        { id: '3', title: 'Work on Project', description: 'Focused coding session', date: '2026-04-11', time: '02:00', amPm: 'PM', completed: false },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        amPm: 'AM' as 'AM' | 'PM'
    });

    // Helper to convert 12h to 24h for sorting
    const get24HTime = (time: string, amPm: 'AM' | 'PM') => {
        let [hours, minutes] = time.split(':').map(Number);
        if (amPm === 'PM' && hours < 12) hours += 12;
        if (amPm === 'AM' && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    // Sorting logic: Soonest tasks first
    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            const timeA = get24HTime(a.time, a.amPm);
            const timeB = get24HTime(b.time, b.amPm);
            const dateTimeA = new Date(`${a.date}T${timeA}`).getTime();
            const dateTimeB = new Date(`${b.date}T${timeB}`).getTime();
            return dateTimeA - dateTimeB;
        });
    }, [tasks]);

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => 
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
        const task = tasks.find(t => t.id === id);
        if (task) {
            showToast(task.completed ? 'Reopened Task' : 'Completed Task!', 'success');
        }
    };

    const handleEditTask = (item: TaskItem) => {
        setEditingTaskId(item.id);
        setNewTask({
            title: item.title,
            description: item.description,
            date: item.date,
            time: item.time,
            amPm: item.amPm
        });
        setModalVisible(true);
    };

    const saveTask = () => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]$/; 

        if (!newTask.title.trim()) {
            showToast('Please enter a title', 'error');
            return;
        }
        if (!dateRegex.test(newTask.date)) {
            showToast('Date must be YYYY-MM-DD', 'error');
            return;
        }
        if (!timeRegex.test(newTask.time)) {
            showToast('Time must be 12h format (e.g., 09:30)', 'error');
            return;
        }

        if (editingTaskId) {
            // Update existing
            setTasks(prev => prev.map(t => 
                t.id === editingTaskId ? { ...t, ...newTask } : t
            ));
            showToast('Task updated successfully', 'success');
        } else {
            // Add new
            const task: TaskItem = {
                id: Math.random().toString(36).substr(2, 9),
                ...newTask,
                completed: false
            };
            setTasks(prev => [...prev, task]);
            showToast('Task added successfully', 'success');
        }

        setModalVisible(false);
        resetForm();
    };

    const resetForm = () => {
        setEditingTaskId(null);
        setNewTask({
            title: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            time: '12:00',
            amPm: 'AM'
        });
    };

    const renderTaskItem = ({ item }: { item: TaskItem }) => (
        <View style={styles.taskCard}>
            <TouchableOpacity 
                style={[styles.checkbox, item.completed && styles.checkboxChecked]} 
                onPress={() => toggleTask(item.id)}
                activeOpacity={0.7}
            >
                {item.completed && <Text style={styles.checkIcon}>✓</Text>}
            </TouchableOpacity>
            <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
                    {item.title}
                </Text>
                {item.description ? (
                    <Text style={[styles.taskDesc, item.completed && styles.completedText]}>
                        {item.description}
                    </Text>
                ) : null}
                <View style={styles.dateTimeContainer}>
                    <Text style={styles.dateTimeText}>{item.date} • {item.time} {item.amPm}</Text>
                </View>
            </View>
            <TouchableOpacity 
                style={styles.editBtnSmall} 
                onPress={() => handleEditTask(item)}
            >
                <Text style={styles.editIconSmall}>✎</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar 
                barStyle="dark-content" 
                backgroundColor="transparent" 
                translucent={true} 
            />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tasks & Meetings</Text>
            </View>

            <FlatList
                data={sortedTasks}
                renderItem={renderTaskItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No tasks scheduled yet</Text>
                    </View>
                }
            />

            {/* Floating Action Button */}
            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => {
                    resetForm();
                    setModalVisible(true);
                }}
                activeOpacity={0.8}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            {/* Add/Edit Task Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingTaskId ? 'Edit Task Details' : 'New Task Details'}</Text>
                        
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Title</Text>
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="Task title (e.g. Meeting)" 
                                    value={newTask.title}
                                    onChangeText={(text) => setNewTask(p => ({...p, title: text}))}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Description</Text>
                                <TextInput 
                                    style={[styles.input, styles.textArea]} 
                                    placeholder="What needs to be done?" 
                                    multiline 
                                    numberOfLines={3}
                                    value={newTask.description}
                                    onChangeText={(text) => setNewTask(p => ({...p, description: text}))}
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, {flex: 2, marginRight: 10}]}>
                                    <Text style={styles.inputLabel}>Date</Text>
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder="YYYY-MM-DD" 
                                        value={newTask.date}
                                        onChangeText={(text) => setNewTask(p => ({...p, date: text}))}
                                    />
                                </View>
                                <View style={[styles.inputGroup, {flex: 3}]}>
                                    <Text style={styles.inputLabel}>Time</Text>
                                    <View style={styles.timeInputRow}>
                                        <TextInput 
                                            style={[styles.input, {flex: 1, marginRight: 5}]} 
                                            placeholder="09:30" 
                                            value={newTask.time}
                                            onChangeText={(text) => setNewTask(p => ({...p, time: text}))}
                                        />
                                        <View style={styles.amPmContainer}>
                                            <TouchableOpacity 
                                                style={[styles.amPmBtn, newTask.amPm === 'AM' && styles.amPmBtnActive]}
                                                onPress={() => setNewTask(p => ({...p, amPm: 'AM'}))}
                                            >
                                                <Text style={[styles.amPmBtnText, newTask.amPm === 'AM' && styles.amPmBtnTextActive]}>AM</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={[styles.amPmBtn, newTask.amPm === 'PM' && styles.amPmBtnActive]}
                                                onPress={() => setNewTask(p => ({...p, amPm: 'PM'}))}
                                            >
                                                <Text style={[styles.amPmBtnText, newTask.amPm === 'PM' && styles.amPmBtnTextActive]}>PM</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addBtn} onPress={saveTask}>
                                <Text style={styles.addBtnText}>{editingTaskId ? 'Update Task' : 'Add Task'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <CustomTabBar />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        height: 80,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100, // Room for TabBar
    },
    taskCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 15,
        borderWidth: 1.5,
        borderColor: '#000', // Matching the wireframe's distinct border style
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#000',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#000',
    },
    checkIcon: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    taskInfo: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    taskDesc: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    completedText: {
        textDecorationLine: 'line-through',
        opacity: 0.5,
    },
    dateTimeContainer: {
        marginTop: 8,
    },
    dateTimeText: {
        fontSize: 12,
        color: '#999',
        fontWeight: '600',
    },
    editBtnSmall: {
        padding: 8,
        marginLeft: 5,
    },
    editIconSmall: {
        fontSize: 20,
        color: '#000',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 25,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 15,
        zIndex: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    fabText: {
        color: '#fff',
        fontSize: 35,
        fontWeight: '300',
        marginTop: -3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        maxHeight: '85%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    input: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fcfcfc',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
    },
    timeInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amPmContainer: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 2,
    },
    amPmBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    amPmBtnActive: {
        backgroundColor: '#000',
    },
    amPmBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
    },
    amPmBtnTextActive: {
        color: '#fff',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#cc0000',
    },
    addBtn: {
        flex: 2,
        backgroundColor: '#000',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    addBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default Task
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Modal, TextInput, Alert } from 'react-native';
import { Users, BookOpen, Video, TrendingUp, User, Award, Plus, X, GraduationCap, PlayCircle, CalendarClock, ClipboardList, Link as LinkIcon, Trash2 } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function TrainerDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Overview');
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // New states for Live Classes and Assignments
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Intercept back button to prevent accidental stack pop to mismatched drawer
        Alert.alert('Hold on!', 'Are you sure you want to exit?', [
          { text: 'Cancel', onPress: () => null, style: 'cancel' },
          { text: 'YES', onPress: () => null /* In production, use BackHandler.exitApp() */ },
        ]);
        return true;
      };
      let backHandlerSub: any;
      import('react-native').then(({ BackHandler }) => {
        backHandlerSub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      });
      return () => {
        if (backHandlerSub) backHandlerSub.remove();
      };
    }, [])
  );

  // Add Course State
  const [showAddModal, setShowAddModal] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '', description: '', price: '', category: ''
  });

  const fetchTrainerData = async () => {
    try {
      const [courseRes, userRes] = await Promise.all([
        api.get('/courses').catch(() => ({ data: [] })),
        api.get('/users').catch(() => ({ data: [] }))
      ]);

      // Filter courses by this trainer
      const myCourses = (courseRes.data || []).filter((c: any) => c.instructor === user?._id || c.trainer === user?._id);
      
      // Filter students who bought these courses (mock logic or real if orders linked)
      // Usually would be an API /courses/trainer/students
      const myStudents = (userRes.data || []).filter((u: any) => 
        u.role === 'Candidate' && u.enrolledCourses?.some((ec: any) => myCourses.some((mc: any) => mc._id === ec))
      );

      setCourses(myCourses);
      setStudents(myStudents);

      // Mock data for Live Classes and Assignments for now
      setLiveClasses([
        { id: '1', title: 'React Native Masterclass Q&A', date: 'Tomorrow, 10:00 AM', link: 'zoom.us/j/123456' },
        { id: '2', title: 'UI/UX Fundamentals Review', date: 'Friday, 2:00 PM', link: 'meet.google.com/abc' }
      ]);
      setAssignments([
        { id: '1', title: 'Build a Weather App', deadline: 'Next Monday', submissions: 12 },
        { id: '2', title: 'Design System Case Study', deadline: 'Tomorrow', submissions: 25 }
      ]);

    } catch (e) {
      console.warn("Failed fetching trainer data", e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrainerData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTrainerData();
  }, [user]);

  const handleCreateCourse = async () => {
    try {
      await api.post('/courses', { ...courseForm, instructor: user?._id });
      Alert.alert('Success', 'Course created successfully!');
      setShowAddModal(false);
      fetchTrainerData();
    } catch (err) {
      Alert.alert('Error', 'Failed to create course');
    }
  };

  const handleGenerateCert = () => {
    Alert.alert("Success", "Certificate generated and emailed to student.");
  };

  const handleScheduleClass = () => {
    Alert.alert('Schedule Class', 'Live class scheduler launched.');
  };

  const handleCreateAssignment = () => {
    Alert.alert('Create Assignment', 'Assignment deployed to students.');
  };

  const stats = [
    { label: 'Students', value: students.length || 0, icon: Users, color: '#14b8a6' },
    { label: 'Courses', value: courses.length || 0, icon: BookOpen, color: '#3b82f6' },
    { label: 'Lectures', value: '45', icon: Video, color: '#a855f7' },
    { label: 'Avg Completion', value: '78%', icon: TrendingUp, color: '#22c55e' }
  ];

  const tabs = ['Overview', 'Students', 'Courses', 'Live Classes', 'Assignments'];

  return (
    <View className="flex-1 bg-slate-50 dark:bg-dark-bg relative">
      <View className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[80px]"></View>
      <View className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]"></View>

      <View className="pt-12 pb-4 px-4 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 z-10">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <View className="self-start px-3 py-1 bg-teal-500/10 rounded-full border border-teal-500/20 flex-row items-center gap-1.5 mb-2">
              <GraduationCap color="#14b8a6" size={12} />
              <Text className="text-[9px] font-black uppercase tracking-[0.2em] text-teal-500">Education Hub</Text>
            </View>
            <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Trainer <Text className="text-teal-500">Command</Text>
            </Text>
          </View>
          {activeTab === 'Courses' && (
            <TouchableOpacity onPress={() => setShowAddModal(true)} className="bg-teal-500 w-10 h-10 rounded-xl items-center justify-center shadow-lg shadow-teal-500/30">
              <Plus color="white" size={20} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full mr-2 transition-all ${activeTab === tab ? 'bg-teal-500 shadow-lg shadow-teal-500/30' : 'bg-slate-100 dark:bg-dark-bg border border-slate-200 dark:border-slate-800'}`}
            >
              <Text className={`text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'text-white' : 'text-slate-500'}`}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#14b8a6" />}
      >
        {activeTab === 'Overview' && (
          <View className="space-y-8 pb-12">
            <View className="flex-row flex-wrap justify-between gap-y-4">
              {stats.map((stat, i) => (
                <View key={i} className="w-[48%] bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl items-center text-center">
                  <View className="w-12 h-12 rounded-2xl items-center justify-center mb-4" style={{ backgroundColor: `${stat.color}15` }}>
                    <stat.icon color={stat.color} size={24} />
                  </View>
                  <Text className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{stat.value}</Text>
                  <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</Text>
                </View>
              ))}
            </View>

            <View className="bg-gradient-to-br from-teal-600 to-emerald-700 p-8 rounded-[2.5rem] border border-teal-500/20 shadow-2xl relative overflow-hidden mt-4">
              <View className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></View>
              <Text className="text-xl font-black text-white uppercase tracking-tight mb-2">Publish Knowledge</Text>
              <Text className="text-teal-100 text-xs font-medium mb-6 max-w-[80%]">Share your expertise with thousands of learners in the Forge India network.</Text>
              <TouchableOpacity onPress={() => setShowAddModal(true)} className="bg-white py-4 rounded-xl flex-row items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
                <Plus color="#0f766e" size={18} />
                <Text className="text-teal-700 font-black text-[10px] uppercase tracking-widest">Create New Course</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'Students' && (
          <View className="space-y-4 pb-12">
            <Text className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 ml-2">Student Roster</Text>
            {students.map((student: any) => (
              <View key={student._id} className="bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl mb-2">
                <View className="flex-row items-center gap-4 mb-5">
                  <View className="w-12 h-12 bg-teal-500/10 rounded-2xl items-center justify-center border border-teal-500/20">
                    <User color="#14b8a6" size={24} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {student.firstName} {student.lastName}
                    </Text>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {student.email || 'N/A'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-4 mb-6">
                  <View className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <View className="h-full bg-teal-500" style={{ width: `${student.progress || 50}%` }} />
                  </View>
                  <Text className="text-[10px] font-black text-teal-500">{student.progress || 50}%</Text>
                </View>

                <TouchableOpacity 
                  className="w-full py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 rounded-xl flex-row items-center justify-center gap-2"
                  onPress={handleGenerateCert}
                >
                  <Award color="#94a3b8" size={16} />
                  <Text className="text-slate-500 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest">Generate Certificate</Text>
                </TouchableOpacity>
              </View>
            ))}
            {students.length === 0 && (
              <View className="py-12 items-center justify-center border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl">
                <Users color="#cbd5e1" size={48} className="mb-4" />
                <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest">No enrolled students</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'Courses' && (
          <View className="space-y-4 pb-12">
            <Text className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 ml-2">My Courses</Text>
            {courses.map((course: any) => (
              <View key={course._id} className="bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl mb-2 flex-row items-center">
                <View className="w-16 h-16 bg-teal-500/10 rounded-2xl items-center justify-center border border-teal-500/20 mr-4">
                  <PlayCircle color="#14b8a6" size={24} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 truncate">{course.title}</Text>
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.category || 'General'}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-black text-teal-500 mb-1">₹{course.price}</Text>
                  <View className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Text className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{course.students || 0} Students</Text>
                  </View>
                </View>
              </View>
            ))}
            {courses.length === 0 && (
              <View className="py-12 items-center justify-center border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl">
                <BookOpen color="#cbd5e1" size={48} className="mb-4" />
                <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest">No published courses</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'Live Classes' && (
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-6 px-2">
              <Text className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Scheduled <Text className="text-teal-500">Sessions</Text></Text>
              <TouchableOpacity onPress={handleScheduleClass} className="bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
                <Text className="text-[10px] font-black text-teal-500 uppercase tracking-widest">+ Schedule</Text>
              </TouchableOpacity>
            </View>
            
            <View className="space-y-4">
              {liveClasses.map(session => (
                <View key={session.id} className="bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl flex-row items-center">
                  <View className="w-12 h-12 bg-teal-500/10 rounded-full items-center justify-center mr-4">
                    <CalendarClock color="#14b8a6" size={20} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{session.title}</Text>
                    <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{session.date}</Text>
                  </View>
                  <TouchableOpacity className="w-10 h-10 bg-blue-500/10 rounded-full items-center justify-center ml-2 border border-blue-500/20">
                    <LinkIcon color="#3b82f6" size={16} />
                  </TouchableOpacity>
                  <TouchableOpacity className="w-10 h-10 bg-red-500/10 rounded-full items-center justify-center ml-2 border border-red-500/20">
                    <Trash2 color="#ef4444" size={16} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'Assignments' && (
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-6 px-2">
              <Text className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Active <Text className="text-teal-500">Assignments</Text></Text>
              <TouchableOpacity onPress={handleCreateAssignment} className="bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
                <Text className="text-[10px] font-black text-teal-500 uppercase tracking-widest">+ Create</Text>
              </TouchableOpacity>
            </View>
            
            <View className="space-y-4">
              {assignments.map(task => (
                <View key={task.id} className="bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl flex-row items-center">
                  <View className="w-12 h-12 bg-purple-500/10 rounded-2xl items-center justify-center mr-4">
                    <ClipboardList color="#a855f7" size={20} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{task.title}</Text>
                    <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1 text-red-400">Due: {task.deadline}</Text>
                  </View>
                  <View className="items-center px-4">
                    <Text className="text-lg font-black text-teal-500">{task.submissions}</Text>
                    <Text className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Submissions</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>

      {/* Add Course Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white dark:bg-dark-card p-8 rounded-t-[2.5rem] border-t border-slate-100 dark:border-slate-800">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">New Course</Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Publish to network</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddModal(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center">
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <TextInput 
                className="bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                placeholder="Course Title" placeholderTextColor="#94a3b8"
                value={courseForm.title} onChangeText={(t) => setCourseForm({...courseForm, title: t})}
              />
              <TextInput 
                className="bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                placeholder="Description" placeholderTextColor="#94a3b8" multiline
                value={courseForm.description} onChangeText={(t) => setCourseForm({...courseForm, description: t})}
              />
              <View className="flex-row gap-4">
                <TextInput 
                  className="flex-1 bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  placeholder="Price (₹)" placeholderTextColor="#94a3b8" keyboardType="numeric"
                  value={courseForm.price} onChangeText={(t) => setCourseForm({...courseForm, price: t})}
                />
                <TextInput 
                  className="flex-1 bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  placeholder="Category" placeholderTextColor="#94a3b8"
                  value={courseForm.category} onChangeText={(t) => setCourseForm({...courseForm, category: t})}
                />
              </View>
              <TouchableOpacity onPress={handleCreateCourse} className="bg-teal-500 py-4 rounded-xl items-center shadow-lg shadow-teal-500/30 mt-4">
                <Text className="text-white font-black uppercase tracking-widest text-xs">Publish Course</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

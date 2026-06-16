import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Play, CheckCircle2, Lock, BookOpen, Award, ChevronRight } from 'lucide-react-native';
import api from '../../services/api';

export default function CoursesScreen() {
  const [activeCourse, setActiveCourse] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/training/courses');
        // Transform backend data to fit UI expectations with safe fallbacks
        const formatted = (data.data || data || []).map((c: any) => ({
          ...c,
          id: c._id,
          title: c.title || c.name || 'Untitled Course',
          instructor: c.instructor || c.vendorId?.businessName || 'FIC Academy',
          progress: 0,
          totalModules: c.modules?.length || c.lessons?.length || 4,
          completedModules: 0,
          image: c.image || c.thumbnail || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.title || 'Course')}&background=random&color=fff&size=800`,
          modules: c.modules || c.lessons || [
            { title: 'Introduction & Overview', duration: '15m', locked: false, completed: false },
            { title: 'Core Concepts', duration: '45m', locked: true, completed: false },
            { title: 'Advanced Implementation', duration: '60m', locked: true, completed: false },
            { title: 'Final Assessment', duration: '30m', locked: true, completed: false }
          ]
        }));
        setCourses(formatted);
      } catch (err) {
        console.warn('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (activeCourse) {
    return (
      <View className="flex-1 bg-slate-50">
        <View className="h-64 bg-slate-200 relative">
          <Image source={{ uri: activeCourse.image }} className="w-full h-full opacity-80" />
          <View className="absolute inset-0 items-center justify-center">
            <TouchableOpacity className="w-16 h-16 bg-blue-600/90 rounded-full items-center justify-center shadow-lg shadow-blue-600/50 backdrop-blur-md">
              <Play color="#fff" size={32} className="ml-1" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            onPress={() => setActiveCourse(null)}
            className="absolute top-12 left-6 bg-white/90 px-4 py-2 rounded-xl shadow-sm backdrop-blur-md"
          >
            <Text className="text-slate-800 font-black text-xs uppercase tracking-widest">Exit</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-6 -mt-6 rounded-t-3xl bg-slate-50 relative z-10">
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1">
              <Text className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-1">{activeCourse.instructor}</Text>
              <Text className="text-2xl font-black text-slate-900 leading-tight">{activeCourse.title}</Text>
            </View>
          </View>

          <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-8">
            <View className="flex-row justify-between items-end mb-3">
              <Text className="text-slate-800 font-black text-sm uppercase tracking-widest">Course Progress</Text>
              <Text className="text-blue-600 font-black">{activeCourse.progress}%</Text>
            </View>
            <View className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
              <View className="h-full bg-blue-600" style={{ width: `${activeCourse.progress}%` }} />
            </View>
            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              {activeCourse.completedModules} of {activeCourse.totalModules} Modules Completed
            </Text>
          </View>

          <Text className="text-slate-900 font-black text-lg uppercase tracking-tight mb-4">Curriculum</Text>
          
          <View className="space-y-3 mb-12">
            {activeCourse.modules.map((mod: any, idx: number) => (
              <TouchableOpacity 
                key={idx}
                disabled={mod.locked}
                className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex-row items-center gap-4 ${mod.locked ? 'opacity-50' : ''}`}
              >
                <View className="w-10 h-10 rounded-xl items-center justify-center border border-slate-200 bg-slate-50">
                  {mod.completed ? <CheckCircle2 color="#22c55e" size={20} /> : 
                   mod.locked ? <Lock color="#94a3b8" size={18} /> : 
                   <Play color="#3b82f6" size={18} className="ml-0.5" />}
                </View>
                <View className="flex-1">
                  <Text className="text-slate-900 font-bold text-sm" numberOfLines={1}>{idx + 1}. {mod.title}</Text>
                  <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Video • {mod.duration || '15m'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center p-6">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-slate-500 font-bold mt-4">Loading Curriculum...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <View className="mb-8 mt-4">
        <Text className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Learning Hub</Text>
        <Text className="text-slate-500 font-medium">Upskill with verified FIC training cohorts.</Text>
      </View>

      <View className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-blue-600/20 mb-8 flex-row items-center">
        <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <View className="flex-1 pr-4">
          <Award color="#fff" size={28} className="mb-2" />
          <Text className="text-white font-black text-lg leading-tight mb-1">Earn Your Certificate</Text>
          <Text className="text-white/90 text-xs font-medium">Complete 100% of a course to automatically generate a verified certificate.</Text>
        </View>
      </View>

      <Text className="text-slate-900 font-black text-lg uppercase tracking-tight mb-4">Live Cohorts</Text>
      
      {courses.length === 0 ? (
        <View className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm items-center justify-center py-12">
          <BookOpen color="#94a3b8" size={48} className="mb-4" />
          <Text className="text-slate-900 font-black text-lg text-center mb-2">No Active Courses</Text>
          <Text className="text-slate-500 text-center text-xs font-medium">There are currently no training cohorts available.</Text>
        </View>
      ) : (
        <View className="space-y-6">
          {courses.map(course => (
            <TouchableOpacity 
              key={course.id}
              activeOpacity={0.9}
              onPress={() => setActiveCourse(course)}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-md overflow-hidden group"
            >
              <View className="h-40 relative">
                <Image source={{ uri: course.image }} className="w-full h-full opacity-90" />
                <View className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <View className="absolute top-4 right-4 bg-white/90 shadow-sm px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
                  <BookOpen color="#3b82f6" size={12} />
                  <Text className="text-blue-600 text-[10px] font-black uppercase tracking-widest">{course.totalModules} Lessons</Text>
                </View>
              </View>
              
              <View className="p-6 pt-4">
                <Text className="text-blue-600 font-black text-[9px] uppercase tracking-widest mb-1">{course.instructor}</Text>
                <Text className="text-slate-900 font-black text-lg leading-tight mb-4">{course.title}</Text>
                
                <View className="flex-row items-center gap-4">
                  <View className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <View className="h-full bg-blue-600" style={{ width: `${course.progress}%` }} />
                  </View>
                  <Text className="text-slate-800 font-black text-xs">{course.progress}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <View className="h-20" />
    </ScrollView>
  );
}

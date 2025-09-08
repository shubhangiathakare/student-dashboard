import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { GraduationCap, Users, BookOpen, BarChart2 } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Colors
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.label}: ${context.raw} (${context.formattedValue}%)`;
        }
      }
    },
  },
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const StatsCard = ({ title, value, icon: Icon, className = '' }) => (
  <Card className={`flex-1 min-w-[200px] ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default function StudentStats({ students, courses }) {
  const chartRef = useRef(null);
  
  // Calculate statistics
  const totalStudents = students.length;
  const totalCourses = courses.length;
  const completionRate = totalStudents > 0 
    ? Math.round((students.filter(s => s.completed).length / totalStudents) * 100) 
    : 0;
  
  // Calculate students per course
  const studentsPerCourse = courses.map(course => ({
    name: course.name,
    count: students.filter(s => s.course === course.name).length
  }));
  
  // Calculate completion rate per course
  const completionRates = courses.map(course => {
    const courseStudents = students.filter(s => s.course === course.name);
    const completed = courseStudents.filter(s => s.completed).length;
    return {
      name: course.name,
      rate: courseStudents.length > 0 
        ? Math.round((completed / courseStudents.length) * 100) 
        : 0
    };
  });

  // Doughnut chart data
  const doughnutData = {
    labels: studentsPerCourse.map(item => item.name),
    datasets: [
      {
        data: studentsPerCourse.map(item => item.count),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data
  const barData = {
    labels: completionRates.map(item => item.name),
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: completionRates.map(item => item.rate),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Students" 
          value={totalStudents} 
          icon={Users} 
        />
        <StatsCard 
          title="Active Courses" 
          value={totalCourses} 
          icon={BookOpen} 
        />
        <StatsCard 
          title="Completion Rate" 
          value={`${completionRate}%`} 
          icon={BarChart2} 
        />
        <StatsCard 
          title="Avg. Students/Course" 
          value={totalCourses > 0 ? Math.round(totalStudents / totalCourses) : 0} 
          icon={GraduationCap} 
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Students per Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Doughnut 
                ref={chartRef}
                data={doughnutData} 
                options={{
                  ...options,
                  plugins: {
                    ...options.plugins,
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const value = context.raw;
                          const percentage = Math.round((value / total) * 100);
                          return `${context.label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Bar 
                data={barData} 
                options={{
                  ...barOptions,
                  scales: {
                    ...barOptions.scales,
                    y: {
                      ...barOptions.scales.y,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Completion Rate (%)'
                      }
                    }
                  }
                }} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

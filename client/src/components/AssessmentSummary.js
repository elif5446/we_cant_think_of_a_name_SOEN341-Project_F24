import React, { useState, useEffect, useRef } from 'react';
import '../styles/AssessmentSummary.css';
import { saveAs } from 'file-saver';
import { Bar } from 'react-chartjs-2';
import ExcelJS from 'exceljs';
import Chart from 'chart.js/auto';

const AssessmentSummary = () => {
    const [summaryData, setSummaryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const chartRef = useRef(null);
    
    useEffect(() => {
        fetchSummaryData();
    }, []);

    const fetchSummaryData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/instructor/assessment-summary');
            if (response.ok) {
                const data = await response.json();
                setSummaryData(data.data);
                if (data.data.length > 0) {
                    setSelectedCourse(data.data[0].courseId);
                }
            } else {
                console.error('Error fetching summary data');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const selectedCourseData = summaryData.find(course => course.courseId === selectedCourse);

 const chartData = selectedCourseData
        ? {
              labels: selectedCourseData.students.map(student => `${student.firstname} ${student.lastname}`),
              datasets: [
                  {
                      label: 'Cooperation Avg',
                      data: selectedCourseData.students.map(student => student.cooperationAvg),
                      backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  },
                  {
                      label: 'Conceptual Avg',
                      data: selectedCourseData.students.map(student => student.conceptualAvg),
                      backgroundColor: 'rgba(153, 102, 255, 0.6)',
                  },
                  {
                      label: 'Practical Avg',
                      data: selectedCourseData.students.map(student => student.practicalAvg),
                      backgroundColor: 'rgba(255, 159, 64, 0.6)',
                  },
                  {
                      label: 'Work Ethic Avg',
                      data: selectedCourseData.students.map(student => student.workEthicAvg),
                      backgroundColor: 'rgba(255, 99, 132, 0.6)',
                  },
                  {
                      label: 'Overall Avg',
                      data: selectedCourseData.students.map(student => student.overallAvg),
                      backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  },
              ],
          }
        : null;

        const exportToExcel = async () => {
            if (!selectedCourseData) return;
        
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Assessment Data');
        
            worksheet.addRow([
                'Student ID',
                'First Name',
                'Last Name',
                'Team',
                'Cooperation',
                'Conceptual',
                'Practical',
                'Work Ethic',
                'Overall',
                'Responses',
            ]);
        
            selectedCourseData.students.forEach(student => {
                worksheet.addRow([
                    student.studentId,
                    student.firstname,
                    student.lastname,
                    student.team,
                    student.cooperationAvg,
                    student.conceptualAvg,
                    student.practicalAvg,
                    student.workEthicAvg,
                    student.overallAvg,
                    student.evaluators.length,
                ]);
            });

            if (chartRef.current) {
                try {
                    const canvas = chartRef.current.canvas;
                    const context = canvas.getContext('2d');
                    
                    const currentConfig = chartRef.current.config;
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = canvas.height;
                    const tempContext = tempCanvas.getContext('2d');
                    
                    tempContext.fillStyle = 'white';
                    tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                    tempContext.drawImage(canvas, 0, 0);
                    
                    const imageBuffer = tempCanvas.toDataURL('image/png').split(',')[1];
                    const imageId = workbook.addImage({
                        base64: tempCanvas.toDataURL('image/png'),
                        extension: 'png',
                    });
                    const chartSheet = workbook.addWorksheet('Chart');
                    chartSheet.addImage(imageId, {
                        tl: { col: 0.5, row: 1 },
                        ext: { width: 600, height: 400 },
                    });
                } catch (error) {
                    console.error('Error capturing chart:', error);
                }
            }
        
            try {
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                saveAs(blob, `${selectedCourseData.courseCode}_Assessment_Summary.xlsx`);
            } catch (error) {
                console.error('Error generating Excel file:', error);
            }
        };
    
    return (
        <div className="assessment-summary">
            <h1>Assessment Summary</h1>
            
            <div className="course-selector">
                <label>Select Course:</label>
                <select 
                    value={selectedCourse || ''} 
                    onChange={(e) => setSelectedCourse(e.target.value)}
                >
                    {summaryData.map(course => (
                        <option key={course.courseId} value={course.courseId}>
                            {course.courseCode} - {course.courseName}
                        </option>
                    ))}
                </select>
            </div>

            {selectedCourseData && (
<div>
                    <div className="summary-table-container">
                        <h2>{selectedCourseData.courseCode} - {selectedCourseData.courseName}</h2>
                        <table className="summary-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Team</th>
                                    <th>Cooperation</th>
                                    <th>Conceptual</th>
                                    <th>Practical</th>
                                    <th>Work Ethic</th>
                                    <th>Overall</th>
                                    <th>Responses</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCourseData.students.map(student => (
                                    <tr key={student.studentId}>
                                        <td>{student.studentId}</td>
                                        <td>{student.firstname}</td>
                                        <td>{student.lastname}</td>
                                        <td>{student.team}</td>
                                        <td>{student.cooperationAvg}</td>
                                        <td>{student.conceptualAvg}</td>
                                        <td>{student.practicalAvg}</td>
                                        <td>{student.workEthicAvg}</td>
                                        <td>{student.overallAvg}</td>
                                        <td>{student.evaluators.length}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="chart-container">
                        <h3>Average Scores</h3>
                        {chartData && (
                            <Bar
                                data={chartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Student Assessment Averages',
                                        },
                                    },
                                    backgroundColor: 'white',
                                    maintainAspectRatio: true
                                }}
                                ref={chartRef}
                            />
                        )}
                    </div>

                    <button onClick={exportToExcel} className="export-button">
                        Export to Excel
                    </button>
                </div>
            )}
        </div>
    );
};

export default AssessmentSummary; 

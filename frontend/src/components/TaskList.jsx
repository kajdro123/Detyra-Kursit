import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useGetTasksQuery } from '../store/apis/taskApi';
import Spinner from './Spinner';
import TaskItem from './TaskItem';

const TaskList = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const { data: tasks = [], isLoading, isError, error } = useGetTasksQuery();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (isLoading) return <Spinner />;

    if (isError) {
        console.error('Gabim gjatë marrjes së detyrave:', error);
        return <p className="error">Error fetching tasks.</p>;
    }

    return (
        <section className='content'>
            {tasks.length > 0 ? (
                <div className='tasks'>
                    {tasks.map(task => (
                        <TaskItem key={task._id} task={task} />
                    ))}
                </div>
            ) : (
                <p>No task's yet.</p>
            )}
        </section>
    );
};
export default TaskList;
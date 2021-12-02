import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, Tooltip } from 'antd';
import { PlusOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import client from 'services/callApi';
import Item from 'components/Item/Item';
import styles from './App.module.scss';

function App() {
    const [item, setItem] = useState(undefined);
    const [type, setType] = useState(0);
    const [list, setData] = useState([]);

    const getTodoList = () => {
        client.get("http://10.62.32.144:3000/api/todo-list")
        .then((response) => {
            setData(Object.values(response).map((data) => ({ ...data, edited: 0 })))
        })
    }

    useEffect(() => {
        getTodoList()
    }, [])

    const onState = async(name, data, key) => {
        const multiTodo = list.filter((todo) => todo.checked).map(data => data.id);

        switch (name) {
            case 'add':
                if (!item) return false;
                await client.post("http://10.62.32.144:3000/api/todo-list", {
                    item: item,
                    checked: false,
                    finished: false
                });
                setItem(undefined);
                getTodoList();
                break;
            case 'edit':
                setData(list.map((todo) => (todo.id === data.id ? { ...todo, edited: 1 } : { ...todo, edited: 0 })));
                break;
            case 'cancel':
                setData(list.map((todo) => ({ ...todo, edited: 0 })));
                getTodoList();
                break;
            case 'confirm':
                await client.put(`http://10.62.32.144:3000/api/todo-list/${key}`, data);
                getTodoList();
                break;
            case 'delete':
                await client.delete(`http://10.62.32.144:3000/api/todo-list/${key}`);
                getTodoList();
                break;
            case 'change':
                setData(list.map((todo) => todo.id === key ? { ...todo, item: data } : todo));
                break;
            case 'filter':
                setData(list.map((todo) => ({ ...todo, edited: false, checked: false })));
                setType(data);
                break;
            case 'check':
                setData(list.map((todo) => ({
                    ...todo,
                    checked: (todo.id === key) ? data : todo.checked,
                })))
                break;
            case 'archive':
                await client.put('http://10.62.32.144:3000/api/todo-list', multiTodo);
                getTodoList();
                break;
            case 'all-delete':
                await client.delete('http://10.62.32.144:3000/api/todo-list', multiTodo);
                getTodoList();
                break;
            default:
                break;
        }
    }

    const filterItem = [
        { label: '未完成', value: 0 },
        { label: '已完成', value: 1 },
    ];

    const isShow = list.map((data) => data.checked).includes(true);

    return (
        <div className={styles.app}>
            <div className={styles.container}>
                <Form>
                    <div className={styles.filter}>
                        <Select
                            className={styles['filter-item']}
                            placeholder="請選擇篩選項目"
                            options={filterItem}
                            defaultValue={0}
                            onChange={(e) => onState('filter', e)}
                        />
                    </div>
                    <div className={styles.more}>
                        {
                            !type &&
                            <Button
                                className={styles['btn-archive']}
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                disabled={!isShow}
                                onClick={() => onState('archive')}
                            >完成</Button>
                        }
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            disabled={!isShow}
                            onClick={() => onState('all-delete')}
                        >刪除</Button>
                    </div>
                    {
                        !type &&
                        <div className={styles.send}>
                            <Input
                                placeholder="請輸入待辦事項"
                                onChange={(e) => setItem(e.target.value)}
                                value={item}
                            />
                            <Tooltip
                                title="新增"
                                placement="bottom"
                            >
                                <Button
                                    className={styles['btn-send']}
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => onState('add')}
                                />
                            </Tooltip>
                        </div>
                    }
                    <div className={styles.content}>
                        {
                            list.map((data, idx) => {
                                if (+data.finished !== type) return false;
                                return <Item
                                    key={idx + 1}
                                    type={type}
                                    list={list}
                                    data={data}
                                    onState={onState}
                                />
                            })
                        }
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default App;

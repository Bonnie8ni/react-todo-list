import React from 'react';
import cx from 'classnames';
import { Tooltip, Input, Button, Checkbox, Popconfirm } from 'antd';
import {
    EditOutlined, CheckOutlined,
    DeleteOutlined, CloseOutlined
} from '@ant-design/icons';
import styles from './Item.module.scss';

function Item({ type, list, data, onState }) {
    const haveEdit = list && list.filter((todo) => todo.edited).length;

    return (
        <div className={styles.item}>
            <Checkbox
                className={styles.checkbox}
                checked={data.checked}
                onChange={(e) => onState('check', e.target.checked, data.id)}
            />
            <Input
                disabled={!data.edited}
                value={data.item}
                checked={data.checked}
                onChange={(e) => onState('change', e.target.value, data.id)}
            />
            {
                (!data.edited && !type) && <Tooltip
                    title="編輯"
                    placement="bottom"
                >
                    <Button
                        className={cx({
                            [styles.btn]: true,
                            [styles['btn-edit']]: true
                        })}
                        disabled={haveEdit}
                        icon={<EditOutlined />}
                        onClick={() => onState('edit', data)}
                    />
                </Tooltip>
            }
            {
                !!data.edited &&
                <>
                    <Tooltip
                        title="確定"
                        placement="bottom"
                    >
                        <Button
                            className={cx({
                                [styles.btn]: true,
                                [styles['btn-confirm']]: true
                            })}
                            icon={<CheckOutlined />}
                            onClick={() => onState('confirm', data, data.id)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="取消"
                        placement="bottom"
                    >
                        <Button
                            className={cx({
                                [styles.btn]: true,
                                [styles['btn-cancel']]: true
                            })}
                            icon={<CloseOutlined />}
                            onClick={() => onState('cancel', data)}
                        />
                    </Tooltip>
                </>
            }
            {
                !data.edited && <Popconfirm
                    title="你確定要刪除這個項目嗎？"
                    onConfirm={() => onState('delete', data, data.id)}
                    okText="確認"
                    cancelText="取消"
                    disabled={haveEdit}
                >
                    <span>
                        <Tooltip
                            title="刪除"
                            placement="bottom"
                        >
                            <Button
                                className={cx({
                                    [styles.btn]: true,
                                    [styles['btn-delete']]: true
                                })}
                                disabled={haveEdit}
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </span>
                </Popconfirm>
            }
        </div>
    )
}

export default Item;
import { Table, Modal, Form, Col, Row, Input, Button, Tag } from 'antd';
import React, { useState, useEffect } from 'react';

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [data, setData] = useState([]);

  const fetchData = () => {
    const storedData = localStorage.getItem('projects');
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      setData([]);
    }
  };

  const saveData = (newData) => {
    localStorage.setItem('projects', JSON.stringify(newData));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setSkills(record.requiredSkills);
    setLocations(record.location);
    setModalOpen(true);
  };

  const handleDelete = (record) => {
    const newData = data.filter((item) => item.key !== record.key);
    saveData(newData);
    setData(newData);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const { requiredSkills, location, ...otherValues } = values;
      const newData = [
        ...data,
        {
          ...otherValues,
          requiredSkills: requiredSkills.split(',').map((skill) => skill.trim()),
          location: location.split(',').map((loc) => loc.trim()),
        },
      ];
      saveData(newData);
      setData(newData);
      setModalOpen(false);
      form.resetFields();
      setSkills([]);
      setLocations([]);
    });
  };
  const handleModalCancel = () => {
    form.resetFields();
    setModalOpen(false);
    setSkills([]);
    setLocations([]);
  };

  const handleTagClose = (removedTag) => {
    const updatedSkills = skills.filter((tag) => tag !== removedTag);
    setSkills(updatedSkills);
  };

  const handleLocationClose = (removedLocation) => {
    const updatedLocations = locations.filter((location) => location !== removedLocation);
    setLocations(updatedLocations);
  };

  const handleInputChange = (e) => {
    debugger;
    setNewSkill(e.target.value);
  };

  const handleLocationInputChange = (e) => {
    setNewLocation(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !skills.includes(value)) {
        const updatedSkills = [...skills, value];
        setSkills(updatedSkills);
        setNewSkill('');
      }
    }
  };

  const handleLocationInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !locations.includes(value)) {
        const updatedLocations = [...locations, value];
        setLocations(updatedLocations);
        setNewLocation('');
      }
    }
  };

  const columns = [
    {
      title: 'Project ID',
      dataIndex: 'projectId',
    },
    {
      title: 'Project Title',
      dataIndex: 'projectTitle',
      sorter: (a, b) => a.projectTitle.localeCompare(b.projectTitle),
      sortDirections: ['ascend', 'descend'],
      sorterType: 'text',
    },
    {
      title: 'Required Skills',
      dataIndex: 'requiredSkills',
      sorter: (a, b) => a.requiredSkills?.join(', ').localeCompare(b.requiredSkills?.join(', ')),
      sortDirections: ['ascend', 'descend'],
      sorterType: 'text',
      render: (skills) => skills?.join(', '),
    },
    {
      title: 'Project Duration',
      dataIndex: 'projectDuration',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      sorter: (a, b) => a.location.join(', ').localeCompare(b.location.join(', ')),
      sortDirections: ['ascend', 'descend'],
      sorterType: 'text',
      render: (locations) => locations.join(', '),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        <>
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
        <Button type="link" danger onClick={() => handleDelete(record)}>
          Delete
        </Button>
      </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setModalOpen(true)}>
        + Add New
      </Button>
      <Modal
        title="Vertically centered modal dialog"
        centered
        visible={modalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="projectId" label="Project ID">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="projectTitle" label="Project Title">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="noOfResources" label="No of resources">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="requiredSkills" label="Required Skills">
                <div>
                  {skills?.map((skill) => (
                    <Tag
                      key={skill}
                      closable
                      onClose={() => handleTagClose(skill)}
                      style={{ marginRight: '8px', marginBottom: '8px' }}
                    >
                      {skill}
                    </Tag>
                  ))}
                  <Input
                    value={newSkill}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Enter a skill"
                  />
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="projectDuration" label="Project Duration">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="location" label="Location">
                <div>
                  {locations.map((location) => (
                    <Tag
                      key={location}
                      closable
                      onClose={() => handleLocationClose(location)}
                      style={{ marginRight: '8px', marginBottom: '8px' }}
                    >
                      {location}
                    </Tag>
                  ))}
                  <Input
                    value={newLocation}
                    onChange={handleLocationInputChange}
                    onKeyDown={handleLocationInputKeyDown}
                    placeholder="Enter a location"
                  />
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="projectArea" label="Project Area">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="projectDescription" label="Project Description">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default App;
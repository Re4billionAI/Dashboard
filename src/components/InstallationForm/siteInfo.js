import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Phone, User, Settings, Wifi, Zap, Gauge, Calendar, MessageSquare, Building, Battery, Sun, Power, Edit3, Check, X, Upload, Camera, Image as ImageIcon } from 'lucide-react';

const SiteInstallationForm = () => {
  const [activeSection, setActiveSection] = useState('siteDetails');
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [formData, setFormData] = useState({
    siteName: 'Modaiyur',
    siteAddress: 'ICICI Bank Ltd, No. 258, Pillayar Koil Street, Modaiyur,Gingi Taluk, Villupuram Dist, Tamil Nadu, Tindivanam, Tamil Nadu, 604206',
    contactNumber: '8056793682',
    contactPerson: 'Mr.Raja',
    ebServiceNo: '',
    boardName: 'STB001',
    boardConfiguration: '24V',
    boardEmail: '',
    boardPassword: '',
    simNetwork: 'Jio Post Paid',
    simSerialNumber: '19',
    rechargePlan: '199',
    simMobileNumber: '9363403600',
    dongleBrand: 'Coconut',
    dongleSerialNumber: '3',
    simConfiguration: '',
    batteryCount: '',
    batteryConfiguration: '',
    batteryBrand: '',
    panelCount: '',
    panelConfiguration: '',
    panelBrand: '',
    inverterBrand: '',
    inverterConfiguration: '',
    totalWattage: 'Ex.500 watts',
    actualSolarVoltage: '',
    actualBatteryVoltage: '',
    actualInverterVoltage: '',
    actualGridVoltage: '',
    rmsSolarVoltage: '',
    rmsBatteryVoltage: '',
    rmsInverterVoltage: '',
    rmsGridVoltage: '',
    rmsTime: '',
    installationDate: '2023-02-20',
    engineerName: 'Shanmugharajan',
    designation: 'Intern Embedded Engineer',
    signature: '',
    remarks: '',
    imageUrl: '',
    imageFileName: ''
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const device = useSelector((state) => state.location.device);
  const cleanSiteId = device.siteId.replace(/[^a-zA-Z0-9-_]/g, '');
  const API_URL = `http://127.0.0.1:5001/rmstesting-d5aa6/us-central1/firebackend/admin/installationForms/${cleanSiteId}`;

  console.log(API_URL);

  const handleImageUrlUpdate = ({ imageUrl, fileName }) => {
    setFormData(prev => ({
      ...prev,
      imageUrl,
      imageFileName: fileName
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          console.log(result.data);
          setData(result.data);
          if (result.data) {
            setFormData(prev => ({
              ...prev,
              ...result.data
            }));
          }
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sections = [
    {
      id: 'siteDetails',
      title: 'Site Details',
      icon: <Building className="w-4 h-4" />
    },
    {
      id: 'rmsBoard',
      title: 'RMS Board',
      icon: <Settings className="w-4 h-4" />
    },
    {
      id: 'network',
      title: 'Network',
      icon: <Wifi className="w-4 h-4" />
    },
    {
      id: 'equipment',
      title: 'Equipment',
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: 'measurements',
      title: 'Measurements',
      icon: <Gauge className="w-4 h-4" />
    },
    {
      id: 'installation',
      title: 'Installation',
      icon: <Calendar className="w-4 h-4" />
    }
  ];

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      setFormData(prev => ({
        ...prev,
        [editingField]: tempValue
      }));
      
      const updatedData = {
        ...formData,
        [editingField]: tempValue,
        lastUpdatedField: editingField,
        lastUpdatedAt: new Date().toISOString()
      };

      const response = await fetch(API_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        setFormData(prev => ({
          ...prev,
          [editingField]: formData[editingField]
        }));
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        setFormData(prev => ({
          ...prev,
          [editingField]: formData[editingField]
        }));
        throw new Error(result.message || 'Failed to update field');
      }

      setEditingField(null);
      setTempValue('');
      
    } catch (error) {
      console.error('Error updating field:', error);
      alert(`Error updating field: ${error.message}`);
      setEditingField(null);
      setTempValue('');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleSectionSubmit = async (sectionId) => {
    try {
      setSaving(true);
      
      const response = await fetch(API_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          lastUpdatedSection: sectionId,
          lastUpdatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.jsonVen();
      
      if (result.success) {
        alert(`${sections.find(s => s.id === sectionId)?.title} section updated successfully!`);
        
        const fetchResponse = await fetch(API_URL);
        if (fetchResponse.ok) {
          const fetchResult = await fetchResponse.json();
          if (fetchResult.success && fetchResult.data) {
            setFormData(prev => ({
              ...prev,
              ...fetchResult.data
            }));
          }
        }
      } else {
        throw new Error(result.message || 'Failed to update data');
      }
    } catch (error) {
      console.error('Error updating section:', error);
      alert(`Error updating ${sections.find(s => s.id === sectionId)?.title} section: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const InputField = ({ label, value, field, type = 'text', placeholder, icon: Icon, required = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />}
       
        {editingField === field ? (
          <div className="flex items-center space-x-2">
            {type === 'textarea' ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder={placeholder}
                className={`flex-1 p-3 ${Icon ? 'pl-10' : ''} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none`}
                rows="3"
                autoFocus
              />
            ) : (
              <input
                type={type}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder={placeholder}
                className={`flex-1 p-3 ${Icon ? 'pl-10' : ''} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                autoFocus
              />
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className={`p-2 transition-colors rounded-lg ${
                saving
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100'
              }`}
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              ) : (
                <Check className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-red-600 hover:text-red-800 transition-colors bg-red-50 rounded-lg hover:bg-red-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            {type === 'textarea' ? (
              <div className={`flex-1 p-3 ${Icon ? 'pl-10' : ''} border border-gray-300 rounded-lg bg-gray-50 min-h-[80px] whitespace-pre-wrap`}>
                {value || <span className="text-gray-400">{placeholder}</span>}
              </div>
            ) : (
              <div className={`flex-1 p-3 ${Icon ? 'pl-10' : ''} border border-gray-300 rounded-lg bg-gray-50`}>
                {value || <span className="text-gray-400">{placeholder}</span>}
              </div>
            )}
            <button
              onClick={() => handleEdit(field, value)}
              className="ml-2 p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-lg"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const SiteImageUploader = ({ siteId, apiUrl, onImageUrlUpdate }) => {
    const [imagePreview, setImagePreview] = useState(formData.imageUrl || null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = async (file) => {
      if (!file) return;

      const validTypes = ['image/jpeg','image/jpg','image/png','image/gif','image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5 MB');
        return;
      }

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('siteId', siteId);

        const uploadRes = await fetch(`http://127.0.0.1:5001/rmstesting-d5aa6/us-central1/firebackend/admin/uploadImage`, {
          method: 'POST',
          body: formData
        });
        if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);

        const { success, imageUrl, fileName, message } = await uploadRes.json();
        if (!success) throw new Error(message || 'Upload failed');

        setImagePreview(imageUrl);
        onImageUrlUpdate({ imageUrl, fileName });
        alert('Image uploaded successfully!');
      } catch (err) {
        console.error(err);
        alert(`Error uploading image: ${err.message}`);
      } finally {
        setUploading(false);
      }
    };

    const handleImageSelect = (e) => {
      const file = e.target.files[0];
      if (file) handleImageUpload(file);
    };

    return (
      <div className="w-full relative group">
        {imagePreview ? (
          <img src={imagePreview} alt="Site" className="w-full h-64 object-cover rounded-xl shadow-lg" />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-xl shadow-lg">
            <Camera className="w-16 h-16 text-white opacity-60" />
            <p className="ml-2 text-white">Click to upload site image</p>
          </div>
        )}

        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
              <div className="animate-spin h-8 w-8 border-b-2 border-white rounded-full" />
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white"
        >
          {uploading
            ? <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full" />
            : <Upload className="w-5 h-5" />
          }
        </button>
      </div>
    );
  };

  const renderSiteDetails = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="w-full relative group">
        <SiteImageUploader
          siteId={cleanSiteId}
          apiUrl={API_URL}
          onImageUrlUpdate={handleImageUrlUpdate}
        />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-white px-6 py-3 rounded-lg shadow-2xl">
            <h1 className="text-3xl font-bold drop-shadow-lg">
              {formData.siteName || "Site Name"}
            </h1>
            <p className="text-sm text-gray-200 drop-shadow-md opacity-100">
              {formData.siteAddress || "Site Address"}
            </p>
          </div>
        </div>
      </div>
     
      <div className="space-y-6">
        <InputField
          label="Site Name"
          value={formData.siteName}
          field="siteName"
          placeholder="Enter site name"
          icon={Building}
          required
        />
        <InputField
          label="Site Address"
          value={formData.siteAddress}
          field="siteAddress"
          placeholder="Enter address"
          type="textarea"
          icon={MapPin}
          required
        />
        <InputField
          label="Contact Number"
          value={formData.contactNumber}
          field="contactNumber"
          placeholder="Enter contact number"
          icon={Phone}
          required
        />
        <InputField
          label="Contact Person Name"
          value={formData.contactPerson}
          field="contactPerson"
          placeholder="Enter contact person"
          icon={User}
          required
        />
        <InputField
          label="EB Service Number"
          value={formData.ebServiceNo}
          field="ebServiceNo"
          placeholder="Enter EB number"
          icon={Power}
        />
      </div>
    </div>
  );

  const renderRMSBoard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Board Name"
          value={formData.boardName}
          field="boardName"
          placeholder="Enter board name"
          icon={Settings}
          required
        />
        <InputField
          label="Board Configuration"
          value={formData.boardConfiguration}
          field="boardConfiguration"
          placeholder="Enter configuration (e.g., 24V)"
          icon={Settings}
          required
        />
      </div>
      <InputField
        label="Board Email ID"
        value={formData.boardEmail}
        field="boardEmail"
        placeholder="Enter board email ID"
        type="email"
        icon={Settings}
      />
      <InputField
        label="Password"
        value={formData.boardPassword}
        field="boardPassword"
        placeholder="Enter password"
        type="password"
        icon={Settings}
      />
    </div>
  );

  const renderNetwork = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="SIM Network"
          value={formData.simNetwork}
          field="simNetwork"
          placeholder="Enter SIM network"
          icon={Wifi}
          required
        />
        <InputField
          label="SIM Serial Number"
          value={formData.simSerialNumber}
          field="simSerialNumber"
          placeholder="Enter SIM serial number"
          icon={Wifi}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Recharge Plan for SIM"
          value={formData.rechargePlan}
          field="rechargePlan"
          placeholder="Enter recharge plan"
          icon={Wifi}
          required
        />
        <InputField
          label="SIM Mobile Number"
          value={formData.simMobileNumber}
          field="simMobileNumber"
          placeholder="Enter mobile number"
          icon={Phone}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Dongle Brand"
          value={formData.dongleBrand}
          field="dongleBrand"
          placeholder="Enter dongle brand"
          icon={Wifi}
          required
        />
        <InputField
          label="Dongle Serial Number"
          value={formData.dongleSerialNumber}
          field="dongleSerialNumber"
          placeholder="Enter dongle serial number"
          icon={Wifi}
          required
        />
      </div>
      <InputField
        label="SIM Configuration"
        value={formData.simConfiguration}
        field="simConfiguration"
        placeholder="Enter SIM configuration"
        icon={Wifi}
      />
    </div>
  );

  const renderEquipment = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Number of Batteries"
          value={formData.batteryCount}
          field="batteryCount"
          placeholder="Enter count"
          icon={Battery}
          required
        />
        <InputField
          label="Battery Configuration"
          value={formData.batteryConfiguration}
          field="batteryConfiguration"
          placeholder="Enter configuration"
          icon={Battery}
          required
        />
        <InputField
          label="Battery Brand"
          value={formData.batteryBrand}
          field="batteryBrand"
          placeholder="Enter brand"
          icon={Battery}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Number of Panels"
          value={formData.panelCount}
          field="panelCount"
          placeholder="Enter count"
          icon={Sun}
          required
        />
        <InputField
          label="Panel Configuration"
          value={formData.panelConfiguration}
          field="panelConfiguration"
          placeholder="Enter configuration"
          icon={Sun}
          required
        />
        <InputField
          label="Panel Brand"
          value={formData.panelBrand}
          field="panelBrand"
          placeholder="Enter brand"
          icon={Sun}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Inverter Brand"
          value={formData.inverterBrand}
          field="inverterBrand"
          placeholder="Enter brand"
          icon={Power}
          required
        />
        <InputField
          label="Inverter Configuration"
          value={formData.inverterConfiguration}
          field="inverterConfiguration"
          placeholder="Enter configuration"
          icon={Power}
          required
        />
        <InputField
          label="Total Wattage of Loads"
          value={formData.totalWattage}
          field="totalWattage"
          placeholder="Ex. 500 watts"
          icon={Zap}
          required
        />
      </div>
    </div>
  );

  const renderMeasurements = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <Gauge className="w-5 h-5 mr-2" />
          Actual Measurements
        </h4>
        <div className="space-y-4">
          <InputField
            label="Solar - Voltage / Ampere"
            value={formData.actualSolarVoltage}
            field="actualSolarVoltage"
            placeholder="Enter solar measurements"
            icon={Sun}
          />
          <InputField
            label="Battery 1,2,3,4 - Voltage / Ampere"
            value={formData.actualBatteryVoltage}
            field="actualBatteryVoltage"
            placeholder="Enter battery measurements"
            icon={Battery}
          />
          <InputField
            label="Inverter - Voltage / Ampere"
            value={formData.actualInverterVoltage}
            field="actualInverterVoltage"
            placeholder="Enter inverter measurements"
            icon={Power}
          />
          <InputField
            label="Grid - Voltage / Ampere"
            value={formData.actualGridVoltage}
            field="actualGridVoltage"
            placeholder="Enter grid measurements"
            icon={Zap}
          />
        </div>
      </div>
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          RMS Measurements
        </h4>
        <div className="space-y-4">
          <InputField
            label="Solar - Voltage / Ampere"
            value={formData.rmsSolarVoltage}
            field="rmsSolarVoltage"
            placeholder="Enter solar measurements"
            icon={Sun}
          />
          <InputField
            label="Battery 1,2,3,4 - Voltage / Ampere"
            value={formData.rmsBatteryVoltage}
            field="rmsBatteryVoltage"
            placeholder="Enter battery measurements"
            icon={Battery}
          />
          <InputField
            label="Inverter - Voltage / Ampere"
            value={formData.rmsInverterVoltage}
            field="rmsInverterVoltage"
            placeholder="Enter inverter measurements"
            icon={Power}
          />
          <InputField
            label="Grid - Voltage / Ampere"
            value={formData.rmsGridVoltage}
            field="rmsGridVoltage"
            placeholder="Enter grid measurements"
            icon={Zap}
          />
          <InputField
            label="Time"
            value={formData.rmsTime}
            field="rmsTime"
            placeholder="Enter measurement time"
            icon={Calendar}
          />
        </div>
      </div>
    </div>
  );

  const renderInstallation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Date of Installation"
          value={formData.installationDate}
          field="installationDate"
          type="date"
          icon={Calendar}
          required
        />
        <InputField
          label="Engineer Name"
          value={formData.engineerName}
          field="engineerName"
          placeholder="Enter engineer name"
          icon={User}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Designation"
          value={formData.designation}
          field="designation"
          placeholder="Enter designation"
          icon={User}
          required
        />
        <InputField
          label="Signature"
          value={formData.signature}
          field="signature"
          placeholder="Enter signature"
          icon={User}
        />
      </div>
      <InputField
        label="Remarks"
        value={formData.remarks}
        field="remarks"
        placeholder="Enter any additional remarks"
        icon={MessageSquare}
        type="textarea"
      />
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'siteDetails':
        return renderSiteDetails();
      case 'rmsBoard':
        return renderRMSBoard();
      case 'network':
        return renderNetwork();
      case 'equipment':
        return renderEquipment();
      case 'measurements':
        return renderMeasurements();
      case 'installation':
        return renderInstallation();
      default:
        return renderSiteDetails();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading site information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full">
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Installation Information</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.icon}
                {section.title}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {renderCurrentSection()}

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => handleSectionSubmit(activeSection)}
              disabled={loading || saving}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                loading || saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {(loading || saving) && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {saving ? 'Saving...' : `Submit ${sections.find(s => s.id === activeSection)?.title}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteInstallationForm;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { MapPin, Phone, User, Settings, Wifi, Zap, Gauge, Calendar, MessageSquare, Building, Battery, Sun, Power, Edit3, Upload, Camera } from 'lucide-react';

// Mock Redux store for standalone demo
const mockStore = {
  location: {
    device: { siteId: 'site_123' }
  }
};

const InputField = React.memo(({ label, value, field, type = 'text', placeholder, icon: Icon, required = false, handleInputChange, isEditingMode }) => {
  console.log(`Rendering InputField: ${field}`);
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-5" />}
        {isEditingMode ? (
          type === 'textarea' ? (
            <textarea
              value={value}
              onChange={(e) => {
                e.stopPropagation();
                handleInputChange(field, e.target.value);
              }}
              onFocus={() => console.log(`Input ${field} focused`)}
              onBlur={() => console.log(`Input ${field} blurred`)}
              placeholder={placeholder}
              className={`w-full min-h-[100px] p-3 ${Icon ? 'pl-10' : ''} border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none shadow-sm text-gray-900 placeholder-gray-400`}
            />
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => {
                e.stopPropagation();
                handleInputChange(field, e.target.value);
              }}
              onFocus={() => console.log(`Input ${field} focused`)}
              onBlur={() => console.log(`Input ${field} blurred`)}
              placeholder={placeholder}
              className={`w-full p-3 ${Icon ? 'pl-10' : ''} border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm text-gray-900 placeholder-gray-400`}
            />
          )
        ) : (
          <div className={`w-full p-3 ${Icon ? 'pl-10' : ''} border border-gray-200 bg-gray-50 ${type === 'textarea' ? 'min-h-[100px] whitespace-pre-wrap' : ''} text-gray-900 shadow-sm`}>
            {value || <span className="text-gray-400">{placeholder}</span>}
          </div>
        )}
      </div>
    </div>
  );
});

const SiteImageUploader = ({ siteId, apiUrl, onImageUrlUpdate, isEditingMode, saving, tempFormData }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setImagePreview(tempFormData?.imageUrl || null);
  }, [tempFormData?.imageUrl]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    onImageUrlUpdate({
      imageFile: file,
      imageFileName: file.name,
      imageUrl: previewUrl,
    });
  }, [onImageUrlUpdate]);

  return (
    <div className="relative group text-center">
      {imagePreview ? (
        <img src={imagePreview} alt="Site" className="w-1/2 w-auto h-1/2 h-full object-contain rounded-md shadow-md" />
      ) : (
        <div className="w-full h-72 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
          <Camera className="w-12 h-12 text-white opacity-80" />
          <p className="ml-3 text-white text-lg font-medium">Upload Site Image</p>
        </div>
      )}
      {isEditingMode && (
        <>
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {saving && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-t-2 border-white rounded-full" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={saving}
            className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full text-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {saving
              ? <div className="animate-spin h-5 w-5 border-t-2 border-gray-700 rounded-full" />
              : <Upload className="w-5 h-5" />
            }
          </button>
        </>
      )}
    </div>
  );
};

const SiteInstallationForm = () => {
  const [activeSection, setActiveSection] = useState('siteDetails');
  const [isEditingMode, setIsEditingMode] = useState(false);
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
  const [tempFormData, setTempFormData] = useState(formData);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const device = useSelector((state) => state.location.device) || mockStore.location.device;
  const cleanSiteId = device.siteId.replace(/[^a-zA-Z0-9-_]/g, '');
  const API_URL = `${process.env.REACT_APP_HOST}/admin/installationForms/${cleanSiteId}`;

  const handleImageUrlUpdate = useCallback(({ imageUrl, fileName, imageFile }) => {
    setTempFormData(prev => ({
      ...prev,
      imageUrl,
      imageFileName: fileName,
      imageFile
    }));
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setTempFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditingMode(false);
    setTempFormData(formData);
  }, [formData]);

  const handleSectionSubmit = useCallback(async (sectionId) => {
    setSaving(true);
    try {
      const hasFileUpload = tempFormData.imageFile && tempFormData.imageFile instanceof File;
      
      if (hasFileUpload) {
        const fd = new FormData();
        Object.entries(tempFormData).forEach(([key, value]) => {
          if (key === 'imageFile') return;
          if (value !== '' && value != null) {
            fd.append(key, value);
          }
        });
        fd.append('image', tempFormData.imageFile, tempFormData.imageFile.name);
        fd.append('siteId', cleanSiteId);
        fd.append('lastUpdatedSection', sectionId);
        fd.append('lastUpdatedAt', new Date().toISOString());

        const res = await fetch(API_URL, {
          method: 'PATCH',
          body: fd,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (!body.success) throw new Error(body.message || 'Update failed');

        setFormData(prev => ({
          ...prev,
          ...body.data,
          imageFile: null
        }));
        setTempFormData(prev => ({
          ...prev,
          ...body.data,
          imageFile: null
        }));
      } else {
        const updateData = {
          ...tempFormData,
          siteId: cleanSiteId,
          lastUpdatedSection: sectionId,
          lastUpdatedAt: new Date().toISOString()
        };
        delete updateData.imageFile;

        const res = await fetch(API_URL, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (!body.success) throw new Error(body.message || 'Update failed');

        setFormData(prev => ({
          ...prev,
          ...body.data
        }));
        setTempFormData(prev => ({
          ...prev,
          ...body.data
        }));
      }

      alert('Update successful!');
      setIsEditingMode(false);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  }, [tempFormData, cleanSiteId, API_URL]);

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
          setData(result.data);
          if (result.data) {
            setFormData(prev => ({
              ...prev,
              ...result.data
            }));
            setTempFormData(prev => ({
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
  }, [API_URL]);

  const sections = [
    { id: 'siteDetails', title: 'Site Details', icon: <Building className="w-5 h-5" /> },
    { id: 'rmsBoard', title: 'RMS Board', icon: <Settings className="w-5 h-5" /> },
    { id: 'network', title: 'Network', icon: <Wifi className="w-5 h-5" /> },
    { id: 'equipment', title: 'Equipment', icon: <Zap className="w-5 h-5" /> },
    { id: 'measurements', title: 'Measurements', icon: <Gauge className="w-5 h-5" /> },
    { id: 'installation', title: 'Installation', icon: <Calendar className="w-5 h-5" /> }
  ];

  const renderSiteDetails = useCallback(() => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="w-full relative group">
        <SiteImageUploader
          siteId={cleanSiteId}
          apiUrl={API_URL}
          onImageUrlUpdate={handleImageUrlUpdate}
          isEditingMode={isEditingMode}
          saving={saving}
          tempFormData={tempFormData}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-gray-700 to-gray-10 p-4 rounded-t-md backdrop-blur-sm shadow-md">
          <h1 className="text-xl font-semibold text-white truncate">
            {formData.siteName || "Site Name"}
          </h1>
          <p className="text-sm text-gray-200 opacity-90 truncate">
            {formData.siteAddress || "Site Address"}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <InputField
          label="Site Name"
          value={tempFormData.siteName}
          field="siteName"
          placeholder="Enter site name"
          icon={Building}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Site Address"
          value={tempFormData.siteAddress}
          field="siteAddress"
          placeholder="Enter address"
          type="textarea"
          icon={MapPin}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Contact Number"
          value={tempFormData.contactNumber}
          field="contactNumber"
          placeholder="Enter contact number"
          icon={Phone}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Contact Person Name"
          value={tempFormData.contactPerson}
          field="contactPerson"
          placeholder="Enter contact person"
          icon={User}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="EB Service Number"
          value={tempFormData.ebServiceNo}
          field="ebServiceNo"
          placeholder="Enter EB number"
          icon={Power}
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
      </div>
    </div>
  ), [tempFormData, formData, isEditingMode, cleanSiteId, API_URL, handleImageUrlUpdate, saving]);

  const renderRMSBoard = useCallback(() => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Board Name"
          value={tempFormData.boardName}
          field="boardName"
          placeholder="Enter board name"
          icon={Settings}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Board Configuration"
          value={tempFormData.boardConfiguration}
          field="boardConfiguration"
          placeholder="Enter configuration (e.g., 24V)"
          icon={Settings}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
      </div>
      <InputField
        label="Board Email ID"
        value={tempFormData.boardEmail}
        field="boardEmail"
        placeholder="Enter board email ID"
        type="email"
        icon={Settings}
        handleInputChange={handleInputChange}
        isEditingMode={isEditingMode}
      />
      <InputField
        label="Password"
        value={tempFormData.boardPassword}
        field="boardPassword"
        placeholder="Enter password"
        type="password"
        icon={Settings}
        handleInputChange={handleInputChange}
        isEditingMode={isEditingMode}
      />
    </div>
  ), [tempFormData, isEditingMode, handleInputChange]);

  const renderNetwork = useCallback(() => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="SIM Network"
          value={tempFormData.simNetwork}
          field="simNetwork"
          placeholder="Enter SIM network"
          icon={Wifi}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="SIM Serial Number"
          value={tempFormData.simSerialNumber}
          field="simSerialNumber"
          placeholder="Enter SIM serial number"
          icon={Wifi}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Recharge Plan for SIM"
          value={tempFormData.rechargePlan}
          field="rechargePlan"
          placeholder="Enter recharge plan"
          icon={Wifi}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="SIM Mobile Number"
          value={tempFormData.simMobileNumber}
          field="simMobileNumber"
          placeholder="Enter mobile number"
          icon={Phone}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Dongle Brand"
          value={tempFormData.dongleBrand}
          field="dongleBrand"
          placeholder="Enter dongle brand"
          icon={Wifi}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Dongle Serial Number"
          value={tempFormData.dongleSerialNumber}
          field="dongleSerialNumber"
          placeholder="Enter dongle serial number"
          icon={Wifi}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
      </div>
      <InputField
        label="SIM Configuration"
        value={tempFormData.simConfiguration}
        field="simConfiguration"
        placeholder="Enter SIM configuration"
        icon={Wifi}
        handleInputChange={handleInputChange}
        isEditingMode={isEditingMode}
      />
    </div>
  ), [tempFormData, isEditingMode, handleInputChange]);

  const renderEquipment = useCallback(() => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Number of Batteries"
          value={tempFormData.batteryCount}
          field="batteryCount"
          placeholder="Enter count"
          icon={Battery}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Battery Configuration"
          value={tempFormData.batteryConfiguration}
          field="batteryConfiguration"
          placeholder="Enter configuration"
          icon={Battery}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Battery Brand"
          value={tempFormData.batteryBrand}
          field="batteryBrand"
          placeholder="Enter brand"
          icon={Battery}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Number of Panels"
          value={tempFormData.panelCount}
          field="panelCount"
          placeholder="Enter count"
          icon={Sun}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Panel Configuration"
          value={tempFormData.panelConfiguration}
          field="panelConfiguration"
          placeholder="Enter configuration"
          icon={Sun}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Panel Brand"
          value={tempFormData.panelBrand}
          field="panelBrand"
          placeholder="Enter brand"
          icon={Sun}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Inverter Brand"
          value={tempFormData.inverterBrand}
          field="inverterBrand"
          placeholder="Enter brand"
          icon={Power}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Inverter Configuration"
          value={tempFormData.inverterConfiguration}
          field="inverterConfiguration"
          placeholder="Enter configuration"
          icon={Power}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Total Wattage of Loads"
          value={tempFormData.totalWattage}
          field="totalWattage"
          placeholder="Ex. 500 watts"
          icon={Zap}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
      </div>
    </div>
  ), [tempFormData, isEditingMode, handleInputChange]);

const renderMeasurements = useCallback(() => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-blue-50 p-6 shadow-sm">
      <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
        <Gauge className="w-5 h-5 mr-2" />
        Actual Measurements
      </h4>
      <div className="space-y-4">
        <InputField
          label="Solar - Voltage / Ampere"
          value={tempFormData.actualSolarVoltage}
          field="actualSolarVoltage"
          placeholder="Enter solar measurements"
          icon={Sun}
          handleInputChange={handleInputChange} // Correct prop name
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Battery 1,2,3,4 - Voltage / Ampere"
          value={tempFormData.actualBatteryVoltage}
          field="actualBatteryVoltage"
          placeholder="Enter battery measurements"
          icon={Battery}
          handleInputChange={handleInputChange} // Fixed the typo here
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Inverter - Voltage / Ampere"
          value={tempFormData.actualInverterVoltage}
          field="actualInverterVoltage"
          placeholder="Enter inverter measurements"
          icon={Power}
          handleInputChange={handleInputChange} // Correct prop name
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Grid - Voltage / Ampere"
          value={tempFormData.actualGridVoltage}
          field="actualGridVoltage"
          placeholder="Enter grid measurements"
          icon={Zap}
          handleInputChange={handleInputChange} // Correct prop name
          isEditingMode={isEditingMode}
        />
      </div>
    </div>
    <div className="bg-green-50 p-6 shadow-sm">
      <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2" />
        RMS Measurements
      </h4>
      <div className="space-y-4">
        <InputField
          label="Solar - Voltage / Ampere"
          value={tempFormData.rmsSolarVoltage}
          field="rmsSolarVoltage"
          placeholder="Enter solar measurements"
          icon={Sun}
          handleInputChange={handleInputChange} // Correct prop name
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Battery 1,2,3,4 - Voltage / Ampere"
          value={tempFormData.rmsBatteryVoltage}
          field="rmsBatteryVoltage"
          placeholder="Enter battery measurements"
          icon={Battery}
          handleInputChange={handleInputChange} // Correct prop name
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Inverter - Voltage / Ampere"
          value={tempFormData.rmsInverterVoltage}
          field="rmsInverterVoltage"
          placeholder="Enter inverter measurements"
          icon={Power}
          handleInputChange={handleInputChange} // Correct prop name
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Grid - Voltage / Ampere"
          value={tempFormData.rmsGridVoltage}
          field="rmsGridVoltage"
          placeholder="Enter grid measurements"
          icon={Zap}
          handleInputChange={handleInputChange} // Correct prop name
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Time"
          value={tempFormData.rmsTime}
          field="rmsTime"
          placeholder="Enter measurement time"
          icon={Calendar}
          handleInputChange={handleInputChange} // Correct prop name
          isEditingMode={isEditingMode}
        />
      </div>
    </div>
  </div>
), [tempFormData, isEditingMode, handleInputChange]);

  const renderInstallation = useCallback(() => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Date of Installation"
          value={tempFormData.installationDate}
          field="installationDate"
          type="date"
          icon={Calendar}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Engineer Name"
          value={tempFormData.engineerName}
          field="engineerName"
          placeholder="Enter engineer name"
          icon={User}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Designation"
          value={tempFormData.designation}
          field="designation"
          placeholder="Enter designation"
          icon={User}
          required
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
        <InputField
          label="Signature"
          value={tempFormData.signature}
          field="signature"
          placeholder="Enter signature"
          icon={User}
          handleInputChange={handleInputChange}
          isEditingMode={isEditingMode}
        />
      </div>
      <InputField
        label="Remarks"
        value={tempFormData.remarks}
        field="remarks"
        placeholder="Enter any additional remarks"
        icon={MessageSquare}
        type="textarea"
        handleInputChange={handleInputChange}
        isEditingMode={isEditingMode}
      />
    </div>
  ), [tempFormData, isEditingMode, handleInputChange]);

  const renderCurrentSection = useCallback(() => {
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
  }, [activeSection, renderSiteDetails, renderRMSBoard, renderNetwork, renderEquipment, renderMeasurements, renderInstallation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading site information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 shadow-lg max-w-md">
          <div className="text-red-500 text-3xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full">
        <div className="text-left mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Information</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditingMode(!isEditingMode)}
              className={`px-4 py-2 font-medium transition-all duration-200 flex items-center gap-2 ${
                isEditingMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Edit3 className="w-5 h-5" />
              {isEditingMode ? 'Cancel' : 'Edit'}
            </button>
            {isEditingMode && (
              <button
                onClick={() => handleSectionSubmit(activeSection)}
                disabled={loading || saving}
                className={`px-6 py-2 font-medium transition-all duration-200 flex items-center gap-2 ${
                  loading || saving
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                }`}
              >
                {(loading || saving) && (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                )}
                {saving ? 'Saving...' : `Submit ${sections.find(s => s.id === activeSection)?.title}`}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md p-4">
          <div className="flex flex-wrap gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.icon}
                {section.title}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-md p-6">
          {renderCurrentSection()}
        </div>
      </div>
    </div>
  );
};

export default SiteInstallationForm;
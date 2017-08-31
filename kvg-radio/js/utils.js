function goBack() {
	window.history.back();
	// window.history.go(-1);
}

function checkConnection() {
	var networkState;
	networkState = navigator.connection.type;

	var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

	return networkState;
}

function isConnected() {
	return checkConnection() != Connection.NONE;
}

function getDeviceId() {
	// device.model
	// device.cordova
	// device.platform
	// device.uuid
	// device.version
	var deviceID = window.device.uuid;
	return deviceID;
}
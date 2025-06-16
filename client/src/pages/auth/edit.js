import { useEffect, useState } from 'react';
import { useAuth } from '../../authContext';
import axios from 'axios';

function Edit() {
  const { user, edit, changePassword, error, message } = useAuth();
  const [userPfpPath, setUserPfpPath] = useState('');
  const [fullname, setFullname] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [description, setDescription] = useState('');

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notification, setNotification] = useState('');

  const handleEdit = (e) => {
    e.preventDefault();
    edit(fullname, subTitle, description, address, phone, gender);
  };
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setNotification(changePassword(oldPassword, newPassword, confirmPassword));
  };

  const handlePfpChange = (e) => {
    e.preventDefault();
    setUserPfpPath(URL.createObjectURL(e.target.files[0]))
    const imageData = new FormData();   
    imageData.append('PfpImage', e.target.files[0]);
    axios.put(
      'http://localhost:8080/profile/edit/pfp',
      imageData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }).then((res) => {
        console.log('pfp response', res.data);
      })
      .catch(err => { console.error(err) });

  };




  useEffect(() => {
    setFullname(user?.PersonalInfo.Fullname ?? '');
    setSubTitle(user?.PersonalInfo.SubTitle ?? '');
    setDescription(user?.PersonalInfo.Description ?? '');
    setUserPfpPath("http://localhost:8080" +user?.PersonalInfo.PfpPath ?? '');
    setAddress(user?.PersonalInfo.Address ?? '');
    setPhone(user?.PersonalInfo.Phone ?? '');
    setGender(user?.PersonalInfo.Gender ?? null);
  }, [user]);


  return (
    <section className="bg-background">
      <div className='flex flex-col lg:flex-row gap-2  py-5 px-5 '>
        <div className='flex flex-col gap-2 w-full lg:w-2/3'>
          <div className="bg-secondary/10 hover:bg-primary/30 transition duration-300 flex flex-row w-full px-10 py-2 mx-auto rounded-lg items-center space-x-10">
            <img className='w-32 h-32 rounded-full' src={userPfpPath} alt="" />
            <button
              type="button"
              className="text-text bg-accent transition duration-300 transform hover:scale-110 hover:shadow-accent hover:shadow-[0_0px_50px_0px_rgba(0,0,0,1)] font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:focus:ring-primary-800"
              onClick={() => document.getElementById('file-input').click()}
            >
              Change photo
            </button>
            <input type='file' id='file-input' className='hidden' onChange={handlePfpChange} />
          </div>
      <div className="bg-secondary/10 hover:bg-primary/30 transition duration-300 flex flex-col w-full px-4 py-8 mx-auto lg:py-16 rounded-lg">
        <h2 className="mb-4 text-xl font-bold text-text">
          Personal info
        </h2>
        <form onSubmit={handleEdit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-text/70"
              >
                Fullname
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-secondary/30 text-text text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                value={fullname}
                placeholder="Enter your fullname"
                onChange={(e) => setFullname(e.target.value)}
                required
              />
                </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="subtitle"
                className="block mb-2 text-sm font-medium text-text/70"
              >
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                id="subtitle"
                className="bg-secondary/30 text-text text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                value={subTitle}
                placeholder="eg. Web Developer, Designer"
                onChange={(e) => setSubTitle(e.target.value)}
                required
              />
            </div>
                
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-text/70"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="8"
                className="block p-2.5 w-full text-sm text-text bg-secondary/30 rounded-lg focus:ring-primary-500"
                placeholder="Enter your description..."
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-text/70"
              >
                Address
              </label>
              <textarea
                id="address"
                rows="2"
                className="block p-2.5 w-full text-sm text-text bg-secondary/30 rounded-lg "
                placeholder="Enter your address..."
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              ></textarea>
            </div>
            <div className="sm:col-span-1">
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-text/70"
              >
                Phone
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                className="bg-secondary/30 text-text text-sm rounded-lg  block w-full p-2.5"
                placeholder="Enter your phone number"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </div>
            <div className="sm:col-span-1">
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-text/70"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="w-full text-sm p-2.5 text-text bg-secondary/30 rounded-lg "
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option className='bg-secondary m-2' disabled selected={user?.PersonalInfo?.Gender === undefined}>Select gender</option>
                <option className='bg-secondary p-2' value="male" selected={user?.PersonalInfo?.Gender === 'male'}>Male</option>
                <option className='bg-secondary p-2' value="female" selected={user?.PersonalInfo?.Gender === 'female'}>Female</option>
                <option className='bg-secondary p-2' value="" selected={user?.PersonalInfo?.Gender === null}>Prefer not to say</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-10">
            <button
              type="submit"
              className="text-text bg-accent transition duration-300 transform hover:scale-110 hover:shadow-accent hover:shadow-[0_0px_50px_0px_rgba(0,0,0,1)] font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:focus:ring-primary-800"
            >
              Update Info
            </button>
          </div>
        </form>
          </div>
      </div>
        <div className='bg-secondary/10 hover:bg-primary/30 transition duration-300 flex flex-col w-full lg:w-1/3 px-4 py-8 mx-auto lg:py-16 lg:px-12 rounded-lg space-y-8'>
        <h2 className=" text-xl font-bold text-text ">
          Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="oldPassword"
              className="block mb-2 text-sm font-medium text-text/70"
            >
              Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter old password"
              className="bg-secondary/30 text-text text-sm rounded-lg focus:border-accent block w-full p-2.5"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="newPassword"
              className="block mb-2 text-sm font-medium text-text/70"
            >
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter new password"
              className="bg-secondary/30 text-text text-sm rounded-lg focus:border-accent block w-full p-2.5"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-text/70"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm new password"
              className="bg-secondary/30 text-text text-sm rounded-lg focus:border-accent block w-full p-2.5"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center space-x-4 mt-10">
            <button
              type="submit"
              className="text-text bg-accent transition duration-300 transform hover:scale-110 hover:shadow-accent hover:shadow-[0_0px_50px_0px_rgba(0,0,0,1)] font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:focus:ring-primary-800"
            >
              Change Password
            </button>
          </div>
          <p className='text-red-600'>{error}</p>
          <p className='text-green-600'>{message}</p>
        </form>
        </div>
      </div>
    </section>
  );
}

function PfpEditor(props) {
  const [zoom, setZoom] = useState(1);
  const [zoomIn, setZoomIn] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);
  const [ratio, setRatio] = useState(1);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  const handleZoomIn = () => {
    setZoomIn(true);
    setZoom(zoom * 1.1);
  };

    const handleSubmit = (e) => {
    e.preventDefault();
    const imageData = new FormData();   
    imageData.append('PfpImage', e.target.files[0]);
    axios.put(
      'http://localhost:8080/profile/edit/pfp',
      imageData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }).then((res) => {
        console.log('pfp response', res.data);
      })
      .catch(err => { console.error(err) });
  };

  const handleZoomOut = () => {
    setZoomOut(true);
    setZoom(zoom / 1.1);
  };

  const handleSliderChange = (e) => {
    setZoom(e.target.value);
  };

  useEffect(() => {
    const img = new Image();
    img.src = props.src;
    img.onload = () => {
      setImgWidth(img.width);
      setImgHeight(img.height);
      setRatio(img.width / img.height);
    };
  }, [props.src]);

  const canvas = document.getElementById("canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;

  useEffect(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(props.src, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(props.src, 0, 0, canvas.width / zoom, canvas.height / zoom);
  }, [zoom, props.src]);



  return (
      <form onSubmit={handleSubmit} className="fixed w-full h-full flex items-center justify-center space-x-4 backdrop-blur-sm">
        <button onClick={handleZoomIn}>
          +
        </button>
        <input
          type="range"
          min="1"
          max="10"
          value={zoom}
          onChange={handleSliderChange}
        />
        <button onClick={handleZoomOut}>
          -
        </button>
      <div className="mt-4">
        <canvas id="canvas" width={imgWidth} height={imgHeight} />
      </div>
      <div className="flex items-center justify-center space-x-4 mt-10">
        <button
          type="submit"
          className="text-text bg-accent transition duration-300 transform hover:scale-110 hover:shadow-accent hover:shadow-[0_0px_50px_0px_rgba(0,0,0,1)] font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:focus:ring-primary-800"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default Edit;





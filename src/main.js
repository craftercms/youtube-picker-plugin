(function () {
  var React = CrafterCMSNext.React;
  var ReactDOM = CrafterCMSNext.ReactDOM;

  async function searchYouTube(keyword, googleApiKey) {
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${keyword}&key=${googleApiKey}`
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data || undefined;
    } catch (ex) {
      return undefined;
    }
  }

  function NoApiKeySet() {
    return /*#__PURE__*/React.createElement('div', {
        className: 'alert alert-warning'
      },
      /*#__PURE__*/React.createElement('span', {
        className: 'fa fa-exclamation-triangle',
        style: {
          marginRight: '5px'
        }
      }),
      'The Google API Key has not been set.');
  }

  function SearchBar({ onSearchSubmit }) {
    const [keyword, setKeyword] = React.useState('');

    const searchChange = (e) => {
      setKeyword(e.target.value);
    };

    const submitSearch = (e) => {
      e.preventDefault();
      onSearchSubmit(keyword);
    };

    return (
      <div>
          <form onSubmit={submitSearch} style={{marginTop:'20px'}}>
            <input
              type="text"
              placeholder="Search YouTube"
              className="form-control"
              onChange={searchChange}
            />
          </form>
        </div>
    );
  }

  function VideoList({ videos, onVideoSelect }) {
    const list = videos.map((video) =>
      <VideoListItem
        onVideoSelect={onVideoSelect}
        key={video.etag}
        video={video}
      />
    );
    return (
      <div>
        <ul className="col-md-4 list-group" style={{marginTop:'20px'}}>
          {list}
        </ul>
      </div>
    )
  }

  function VideoListItem({ video, onVideoSelect }) {
    const imgUrl = video.snippet.thumbnails.default.url;
    return (
      <li className="list-group-item"  onClick={() => onVideoSelect(video)}>
        <div className="video-list-media">
          <div className="media-left">
            <img className="media-object" src={imgUrl} />
          </div>

          <div className="media-body">
            <div className="media-heading">
              <div>{video.snippet.title}</div>
            </div>
          </div>

        </div>
      </li>
    );
  }

  function VideoDetail({ video }) {
    if (!video) {
      return(
        <div>
        </div>
      )
    }

    const videoId = video.id.videoId;
    const url = `https://youtube.com/embed/${videoId}`;

    return (
      <div className="video-detail col-md-8">
        <div className="embed-responsive embed-responsive-16by9" style={{marginTop:'20px'}}>
          <iframe className="embed-responsive-item" src={url}></iframe>
        </div>
        <div className="details">
          <div>{video.snippet.title}</div>
          <div>{video.snippet.description}</div>
        </div>
      </div>
    )
  }

  function MyPicker({ googleApiKey }) {
    const [selectedVideo, setSelectedVideo] = React.useState(null);
    const [videos, setVideos] = React.useState([]);

    const videoSearch = async (keyword) => {
      const res = await searchYouTube(keyword, googleApiKey);

      if (res && res.items && res.items.length >= 0) {
        setVideos(res.items);
        setSelectedVideo(res.items[0]);
        const video = res.items[0];
        updateInputs(video);
      }
    };

    const onSelectVideo = (video) => {
      setSelectedVideo(video);
      updateInputs(video);
    };

    const updateInputs = (video) => {
      if (typeof $ !== 'function') return;

      const $youtubeIdEl = $('#youtubeID_s input');
      const isIdElDisabled = Boolean($youtubeIdEl.attr('disabled'));
      const $titleEl = $('#title_s input');
      const isTitleElDisabled = Boolean($titleEl.attr('disabled'));
      const $descriptionEl = $('#description_t textarea');
      const isDescriptionElDisabled = Boolean($descriptionEl.attr('disabled'));
      const $posterImageEl =  $('#posterImage_s input');
      const isPosterImageElDisabled = Boolean($posterImageEl.attr('disabled'));

      isIdElDisabled && $youtubeIdEl.prop('disabled', false);
      isTitleElDisabled && $titleEl.prop('disabled', false);
      isDescriptionElDisabled && $descriptionEl.prop('disabled', false);
      isPosterImageElDisabled && $posterImageEl.prop('disabled', false);

      $youtubeIdEl.focus();
      $youtubeIdEl.val(video.id.videoId);

      $titleEl.focus();
      $titleEl.val(video.snippet.title);

      $descriptionEl.focus();
      $descriptionEl.val(video.snippet.description);

      $posterImageEl.focus();
      $posterImageEl.val(video.snippet.thumbnails.high.url);
      $posterImageEl.blur();

      isIdElDisabled && $youtubeIdEl.prop('disabled', true);
      isTitleElDisabled && $titleEl.prop('disabled', true);
      isDescriptionElDisabled && $descriptionEl.prop('disabled', true);
      isPosterImageElDisabled && $posterImageEl.prop('disabled', true);
    }

    if (googleApiKey !== '') {
      return (
        <div>
          <h4>YouTube Picker</h4>
          <SearchBar onSearchSubmit={(keyword) => videoSearch(keyword)} />
          <VideoDetail video={selectedVideo}/>
          <VideoList
            onVideoSelect={(selectedVideo) => onSelectVideo(selectedVideo)}
            videos={videos}
          />
        </div>
      );
    } else {
      return (
        <div>
          <h4>YouTube Picker</h4>
          <NoApiKeySet />
        </div>
      )
    }
  }

  CStudioForms.Controls.Youtube =
  CStudioForms.Controls.Youtube ||
  function(id, form, owner, properties, constraints) {
    this.owner = owner;
    this.owner.registerField(this);
    this.errors = [];
    this.properties = properties;
    this.constraints = constraints;
    this.inputEl = null;
    this.countEl = null;
    this.required = false;
    this.value = '_not-set';
    this.form = form;
    this.id = id;
    this.supportedPostFixes = ['_s'];

    if (properties) {
      var required = constraints.find(function(property) {
        return property.name === 'required';
      });
      if (required) {
        this.required = required.value === 'true';
      }
      var googleapi_key = properties.find(function(property) {
        return property.name === 'googleapi_key';
      });
      if (googleapi_key) {
        this.googleapi_key = googleapi_key.value;
      }
    }

    return this;
  };

  YAHOO.extend(CStudioForms.Controls.Youtube, CStudioForms.CStudioFormField, {
    getLabel: function() {
      return 'YouTube Picker';
    },

    render: function(config, containerEl) {
      // we need to make the general layout of a control inherit from common
      // you should be able to override it -- but most of the time it wil be the same
      containerEl.id = this.id;
      var googleApiKey = this.googleapi_key;

      ReactDOM.render( /*#__PURE__*/React.createElement(MyPicker, { googleApiKey }), containerEl);
    },

    getValue: function() {
      return this.value;
    },

    setValue: function(value) {
      this.value = value;
    },

    getName: function() {
      return 'youtube';
    },

    getSupportedProperties: function() {
      return [{ label: 'Google API Key', name: 'googleapi_key', type: 'string', defaultValue: '' }];
    },

    getSupportedConstraints: function() {
      return [];
    },

    getSupportedPostFixes: function() {
      return this.supportedPostFixes;
    }
  });

  CStudioAuthoring.Module.moduleLoaded('youtube', CStudioForms.Controls.Youtube);
})();

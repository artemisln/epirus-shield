Pod::Spec.new do |s|
  s.name           = 'CallDetector'
  s.version        = '1.0.0'
  s.summary        = 'Foreground call observation for Epirus Shield (CallKit CXCallObserver).'
  s.description    = 'Local Expo module that reports call activity while the app is running.'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.frameworks = 'CallKit'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end

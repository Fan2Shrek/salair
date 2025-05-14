export function useFileUploadProgress() {
    const authStore = useAuthStore();
    const progress = ref(0);
    const isUploading = ref(false);
    const isSuccess = ref(false);
    const isError = ref(false);
    const responseData = ref<any>(null);

    const upload = (file: File, url: string) => {
        return new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('logo', file);

            isUploading.value = true;
            isSuccess.value = false;
            isError.value = false;
            progress.value = 0;
            responseData.value = null;

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    progress.value = Math.round((e.loaded / e.total) * 100);
                }
            };

            xhr.onload = () => {
                isUploading.value = false;
                if (xhr.status >= 200 && xhr.status < 300) {
                    isSuccess.value = true;
                    try {
                        responseData.value = JSON.parse(xhr.responseText);
                    } catch {
                        responseData.value = xhr.responseText;
                    }
                    resolve(responseData.value);
                } else {
                    isError.value = true;
                    reject(xhr.responseText);
                }
            };

            xhr.onerror = () => {
                isUploading.value = false;
                isError.value = true;
                reject(xhr.statusText);
            };

            xhr.open('POST', url);
            xhr.setRequestHeader('Authorization', `Bearer ${authStore.accessToken}`);
            xhr.send(formData);
        });
    };

    return { upload, progress, isUploading, isSuccess, isError, responseData };
}
